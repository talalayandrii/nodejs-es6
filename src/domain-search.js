import unirest from 'unirest';

/**
 * class DomainSearch
 */
export default class DomainSearch {

  /**
   * Constructor
   * @param apiInfo
   */
  constructor(apiInfo) {
    this.apiInfo = apiInfo;
  }

  /**
   * Obtains domain's status
   *
   * @param domain
   * @param cb
   */
  getStatus(domain, cb) {
    var url = this.getServiceUrl({
      'mashape-key': this.apiInfo.mashapeKey,
      'domain': DomainSearch.getArrayOfDomains(domain.domain, ...domain.zones)
    });

    unirest.get(url)
      .header("X-Mashape-Key", this.apiInfo.mashapeKey)
      .header("Accept", "application/json")
      .end(result => {
        var status = result.status;
        var response = result.body;

        if (status !== 200) {
          cb(true, response);
        } else {
          cb(false, [...prepareResponse(response.status)]);
        }
      });
  }

  getServiceUrl(parameters) {
    return [
      this.apiInfo.url, '/', this.apiInfo.version,
      '/status?', buildQueryParameters(parameters)
    ].join('');
  }

  static getArrayOfDomains(domain, ...zones) {
    var iter = function* (zones) {for (let zone of zones) yield (domain + zone)};
    return [...iter(zones)];
  }
}


/**
 * Just allows to iterate through an object
 *
 * (!) Uses by getServiceUrlParameters function
 *
 * @param obj
 */
function* getIterOfObject(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

/**
 * Builds query parameters
 *
 * @param parameters
 * @returns {string}
 */
function buildQueryParameters(parameters) {
  var rs = [];

  for (let [k, v] of getIterOfObject(parameters)) {
    if (Array.isArray(v)) {
      rs.push(k + '=' + encodeURIComponent(v.join(',')));
    } else if (typeof v === 'string') {
      rs.push(k + '=' + encodeURIComponent(v));
    }
  }

  return rs.join('&');
}

/**
 * Prepares status response
 *
 * @param {Array} arr
 */
function* prepareResponse(arr) {
  for (let i in arr) {
    yield {
      domain: arr[i].domain,
      zone: arr[i].zone,
      status: arr[i].summary
    };
  }
}
