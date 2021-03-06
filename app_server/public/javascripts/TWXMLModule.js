
function library( module ){
  $( function() {
    if (module.init) {
      module.init();
    }
  });
  return module;
}

var TWXMLModule = library( function () {
  var _jsonPrinter, _buildServerErrorMessage;

  // A private variables:
  _jsonPrinter = JSONPrinter.json;

  // A private method
  _buildServerErrorMessage = function(error) {
    response = JSON.parse(error.responseText);
    var msg = "<div class='alert alert-danger'> " +
    "<p>Error: <b>" + response.errorMessage +
    "</b> ( ID: " + response.errorId + " ) - " + error.statusText + "</p></div>";
    return msg;
  };

  return {
    init: function() {
      // module implementation
    },

    getJobStatus: function (event, params, content_element, status_element) {
      event.preventDefault();
      $.get('/actions/jobStatus', params, function(data) {
        $(content_element).html(_jsonPrinter.prettyPrint(data));
      }).fail(function(data) {
        $(status_element).html(_buildServerErrorMessage(data));
        $(status_element).show();
      });
    },

    getJobResults: function (event, params, content_element, status_element) {
      event.preventDefault();
      $.get('/actions/jobResults', params, function(data) {
        $(content_element).html(_jsonPrinter.prettyPrint(data));
      }).fail(function(data) {
        $(status_element).html(_buildServerErrorMessage(data));
        $(status_element).show();
      });
    }
  };
}());
