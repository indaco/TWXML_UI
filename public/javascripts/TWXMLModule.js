
function library( module ){
  $( function() {
    if (module.init) {
      module.init();
    }
  });
  return module;
}

var TWXMLModule = library( function () {
  var jsonPrinter,
      _buildHeaders,
      _buildErrorMessage,
      _buildServerErrorMessage,
      _buildServerResponse,
      _countFeatures;

  // A private variables:
  jsonPrinter = JSONPrinter.json;

  _buildHeaders = function(app_id, standard) {
    var h = {
      'Accept': 'application/json',
      'neuron-application-id':app_id
    };
    if(standard) {
      h['Content-Type'] = 'application/json';
    }
    return h;
  };

  _buildErrorMessage = function(xhr) {
    return "<div class='alert alert-danger'>Error: <b>" + JSON.parse(xhr.responseText).errorMessage + "</b></div>";
  };

  _buildServerErrorMessage = function(data) {
    var msg = "<div class='alert alert-danger'> " +
    "<p>Error: <b>" + JSON.parse(data.responseText).errorMessage +
    "</b> ( ID: " + JSON.parse(data.responseText).errorId + " )</p></div>";
    return msg;
  };

  _buildServerResponse = function(json) {
     return JSONPrinter.json.prettyPrint(json);
  };

  _countFeatures = function(obj) {
    return obj.length;
  };

  return {
    init: function() {
      // module implementation
    },

    getHeaders: function(app_id, standard) {
      return _buildHeaders(app_id, standard);
    },

    buildURL: function(path) {
      var _ssl = (_ssl == CONFIGS.ssl);
      var protocol = (_ssl) ? "https" : "http";
      return protocol + "://" + CONFIGS.host + ":" + CONFIGS.port + "/1.0" + path;
    },

    showServerResponse: function(element, json) {
      $(element).html(_buildServerResponse(json));
    },

    showErrorMessage: function(element, xhr) {
      var msg = _buildErrorMessage(xhr);
      $(element).html(_buildErrorMessage(xhr));
    },

    showServerErrorMessage: function(element, data) {
      $(element).html(_buildServerErrorMessage(data));
      $(element).show();
    },

    getFileInfo: function (files) {
      var output = [];
      // files is a FileList of File objects. List some properties.
      for (var i = 0, f; f = files[i]; i++) {
        output.push('<li>Filename: <strong>', escape(f.name), '</strong> (', f.type || 'n/a', ')  </li> ',
          '<li> Dimension: ', f.size, ' bytes</li>',
          '<li> Last modified: ', f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a', '</li>');
      }
      return output;
    },

    retrieveGoals: function(json) {
      goals = [];
      $.each(json, function(idx, obj) {
         if(obj.objective === true) {
           goals.push(obj.fieldName);
         }
       });
       return goals;
    },

    getDataSetInfo: function(json) {
      var output = [];
      output.push('<li>No. Features: <strong>' + _countFeatures(json) + '</strong></li>');
      output.push('<li> Goals: <strong>' + this.retrieveGoals(json) + '</strong></li>');
      return output;
    },

    getJobResults: function (event, input_element, job_id_element, job_type, content_element, status_element) {
      event.preventDefault();
      var _dsName = $(input_element).val();
      var _jobIDValue = $(job_id_element).val();
      var _url = this.buildURL("/datasets/" + _dsName + "/" + job_type + "/" + _jobIDValue + "/results");
      this.doGET(
        this.getHeaders(CONFIGS.neuron_app_id),
        _url,
        function(json_response) {
          $(content_element).html(JSONPrinter.json.prettyPrint(json_response));
        },
        function(xhr, status, error) {
          $(status_element).html(_buildErrorMessage(xhr));
        }
      );
    },

    /*getJobStatus: function (event, input_element, content_element, status_element) {
      event.preventDefault();
      //job_id_value = $(input_element).val();
      var _jobIDValue = $(input_element).val();
      var _url = this.buildURL("/status/" + _jobIDValue);
      this.doGET(
        this.getHeaders(CONFIGS.neuron_app_id),
        _url,
        function(json_response) {
          $(content_element).html(JSONPrinter.json.prettyPrint(json_response));
        },
        function(xhr, status, error) {
          $(status_element).html(_buildErrorMessage(xhr));
        }
      );
    },*/

    getJobStatus: function (event, params, content_element, status_element) {
      event.preventDefault();
      $.get('/job_status', params, function(data) {
        $(content_element).html(JSONPrinter.json.prettyPrint(data));
      }).fail(function(data) {
        $(status_element).html(_buildServerErrorMessage(data));
        $(status_element).show();
      });
    },

    doGET: function(header, url, successFunc, errorFunc) {
      $.ajax({
        type: "GET",
        dataType: "json",
        headers: header,
        url: url,
        success: successFunc,
        error: errorFunc
      });
    },

    doPOST: function(header, url, body, successFunc, errorFunc) {
      $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        headers: header,
        data: JSON.stringify(body),
        success: successFunc,
        error: errorFunc
      });
    },

    doDELETE: function(header, url, beforeSendFunc, successFunc, errorFunc) {
      $.ajax({
        type: "DELETE",
        url: url,
        dataType: "json",
        data: null,
        headers: header,
        beforeSend: beforeSendFunc,
        success: successFunc,
        error: errorFunc
      });
    }
  };
}());
