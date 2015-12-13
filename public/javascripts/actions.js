// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser. Try with another one, e.g. Google Chrome');
}

function _buildURL(path) {
  var _ssl = (_ssl == CONFIGS.ssl);
  var protocol = (_ssl) ? "https" : "http";
  return protocol + "://" + CONFIGS.host + ":" + CONFIGS.port + "/1.0" + path;
}

function _setDSInputFields(ds_name) {
  $('#config_dsName_input').val(ds_name);
  $('#upload_dsName_input').val(ds_name);
  $('#filters_ds_name_input').val(ds_name);
  $('#signals_ds_name_input').val(ds_name);
  $('#profiles_ds_name_input').val(ds_name);
  $('#clusters_ds_name_input').val(ds_name);
  $('#predictions_ds_name_input').val(ds_name);
}

function _setDSGoalsSelectField(goals) {
  var opts = [];
  $.each(goals, function(idx, obj) {
    opts.push("<option value='" + obj + "'>" + obj + "</option>");
  });
  $('#signals_ds_goal_select').html(opts);
  $('#profiles_ds_goal_select').html(opts);
  $('#clusters_ds_goal_select').html(opts);
  $('#predictions_ds_goal_select').html(opts);
}

function _drawRow(rowData) {
  var row = $("<tr />");
  $("#dataSetTable").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
  row.append($('<td class="dsname">' + rowData.name + '</td>'));
  row.append($('<td>' + rowData.description + '</td>'));
  row.append($('<td>' + rowData.optimized + '</td>'));
  row.append($("<td><button class='btn btn-primary btnUseIt' aria-label='Left Align'><span class='glyphicon glyphicon-pencil' aria-hidden='true'/> Use it</button> <button class='btn btn-danger btnDelete' aria-label='Left Align'><span class='glyphicon glyphicon-trash' aria-hidden='true'/> Delete</button></td>"));
}

function _clearCreationFields() {
  $('#create_dsName').val("");
  $('#description').val("");
}

function _countDataSets() {
  $('#rowCount').html("[ # " + ($('#dataSetTable tr').length - 1) + " ]");
}

function _showAjaxErrorMessage(element, xhr) {
  $(element).html("<div class='alert alert-danger'>Error: <b>" + JSON.parse(xhr.responseText).errorMessage + "</b></div>");
  $(element).show();
}

function _showServerResponse(element, data) {
  $(element).html(JSONPrinter.json.prettyPrint(data));
}

function _showSuccessMessage(element, msg) {
  $(element).html("<div class='alert alert-success'>Status: <b>" + msg + "</b></div>");
  $(element).show();
}

function _showErrorMessage(element, data) {
  var msg = "<div class='alert alert-danger'> " +
    "Error: <br/><b>" + data.responseJSON.errorMessage +
    "</b> <br/>( ID: " + data.responseJSON.errorId + " )</div>";
  $(element).html(msg);
  $(element).show();
}

function _getDataSetInfo(json) {
  var output = [];
  output.push('<li>No. Features: <strong>' + json.length + '</strong></li>');
  output.push('<li> Goals: <strong>' + retrieveGoals(json) + '</strong></li>');
  return output;
}

function _retrieveGoals(json) {
  goals = [];
  $.each(json, function(idx, obj) {
     if(obj.objective === true) {
       goals.push(obj.fieldName);
     }
   });
   return goals;
}

function useIt(datasetName, errorArea) {
  $.get('/use_dataset', {dsName: datasetName}, function(data) {
    _setDSInputFields(datasetName);
    _setDSGoalsSelectField(_retrieveGoals(data));
  }).fail(function(data) {
    _showErrorMessage(errorArea, data);
  });
}

/*********************/
/* GET DATA SET LIST */
/*********************/
function getDataSetList() {
  $.get('/dataset_list', function(data) {
    for (i = 0; i < data.length; i++) {
      _drawRow(data[i], i);
    }
    //_countDataSets();
  }).fail(function(data) {
    _showErrorMessage('#dsList_status_response', data);
  });
}


$(document).ready(function() {
  // TWXMLModule initialization
  var twxml_module = TWXMLModule;
  // inline help for input fields
  $(function() {
    $('[data-toggle="popover"]').popover();
  });
  // regtrieve existing datasets
  getDataSetList();

  /*****************/
  /* CHECK VERSION */
  /*****************/
  $('#checkVersionBtn').click(function(event) {
    event.preventDefault();
    $.get('/version', function(data) {
      alert("You are using ThingWorx ML revision: " + data.implementationVersion);
    }).fail( function(data) {
        alert(data);
    });
  });

  /*******************/
  /* CREATE DATA SET */
  /*******************/
  $('#createbtn').click(function(event) {
    event.preventDefault();
    var _requestBody = {
      "name": $('#create_dsName').val(),
      "description": $('#description').val()
    };
    $.post('/create_dataset', _requestBody, function(data) {
      _setDSInputFields(_requestBody.name);
      //$('#create_content').html(JSONPrinter.json.prettyPrint(data));
      _showServerResponse('#create_content', data);
      _drawRow(data);
      //_countDataSets();
      _clearCreationFields();
      $('#create_status_response').html("");
      $('#create_status_response').hide();
    }).fail(function(data) {
      _showErrorMessage('#create_status_response', data);
    });
  });

  /*******************/
  /* USE DATA SET */
  /*******************/
  $('#dataSetTable').on('click', '.btn.btn-primary.btnUseIt', function(event) {
    event.preventDefault();
    var parent = $(this).parent("td").parent("tr");
    var _dsName = $(this).closest("tr").find(".dsname").text();

    useIt(_dsName, '#dsList_status_response');
  });

  /*******************/
  /* DELETE DATA SET */
  /*******************/
  $('#dataSetTable').on('click', '.btn.btn-danger.btnDelete', function(event) {
    var answer = confirm("Do you wish to delete this data set?");
    if (answer === true) {
      event.preventDefault();
      var parent = $(this).parent("td").parent("tr");
      var _dsName = $(this).closest("tr").find(".dsname").text();
      $.ajax({
        type: 'DELETE',
        url: '/delete_dataset',
        data: {"dsName": _dsName},
        beforeSend: function() {
          parent.animate({
            'background-color': '#fb6c6c'
          }, 300);
        },
        success: function() {
          parent.fadeOut(300, function() {
            parent.remove();
          });
          _clearCreationFields();
        },
        error: function(xhr, status, error) {
          _showAjaxErrorMessage('#create_status_response', xhr);
        }
      });
    }
  });

  /**********************/
  /* CONFIGURE DATA SET */
  /**********************/
  $('#input_json_file').bootstrapFileInput();
  $('#input_json_file').on('change', function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    var _files = event.target.files;

    var reader = new FileReader();
    reader.readAsText(_files[0], "UTF-8");
    reader.onload = function(evt) {
      var content = JSON.parse(evt.target.result);
      var _requestBody ={
        dsName: $('input[name=config_dsName_input]').val(),
        fileContent: JSON.stringify(content)
      };
      $.post('/configure', _requestBody, function(data, status) {
          _showSuccessMessage('#config_status_response', status);
          _showServerResponse('#json_content', data);
          //$('#json_content').html(JSONPrinter.json.prettyPrint(data));
          useIt(_requestBody.dsName, '#config_status_response');
      }).fail(function(data) {
        _showErrorMessage('#json_content', data);
      });
    };

    reader.onerror = function(xhr, status, error) {
      _showAjaxErrorMessage('#config_status_response', xhr);
    };
  });

  /*******************/
  /* UPLOAD DATA SET */
  /*******************/
  $('#upl').bootstrapFileInput();
  $('#upl').on('change', function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    var _dsName = $('#upload_dsName_input').val();
    var _headers = {
      'Accept': 'application/json',
      'neuron-application-id':CONFIGS.neuron_app_id
    };
    var _url = _buildURL("/datasets/" + _dsName + "/data");
    var _files = event.target.files;

    if (window.FormData) {
      formdata = new FormData();
      formdata.append('file', _files[0]);
      $("uploadbtn").css("display", "none");
      if (formdata) {
        $('#collapseThree').addClass('in');
        $('#collapseTwo').addClass('in');

        $.ajax({
          url: _url,
          type: "POST",
          headers: _headers,
          data: formdata,
          processData: false,
          contentType: false,
          success: function(json, textStatus, xhr) {
            _showSuccessMessage('#upload_status_response', textStatus);
            _showServerResponse('#upload_content', json);
            $('#upload_job_id_input').val(json.resultId);
            $('#collapseFour').addClass('in');
          },
          error: function(xhr, status, error) {
            _showAjaxErrorMessage('#upload_status_response', xhr);
          }
        });
      }
    }
  });

  /**********************************/
  /* GET UPLOAD DATA SET JOB STATUS */
  /**********************************/
  $('#get_upload_status_btn').click(function(event) {
    var params = {
      jobID: $('#upload_job_id_input').val()
    };
    twxml_module.getJobStatus(event, params, '#upload_content', '#upload_status_response');
  });

  /*******************/
  /* SUBMIT SIGNALS  */
  /*******************/
  $('#signals-btn').click(function(event) {
    event.preventDefault();
    var _requestBody = {
      'dsName': $('#signals_ds_name_input').val(),
      'goal': $('#signals_ds_goal_select').find(":selected").val(),
      'description': $('#signals_goal_desc_input').val(),
      'maxAtATime': $('#signals_max_input').val()
    };

    $.post('/submit_signals', _requestBody, function(data, status) {
      $('#collapseFive').addClass('in');
      _showSuccessMessage('#signals_status_response', status);
      _showServerResponse('#signals_content', data);
      $('#signals_job_id_input').val(data.resultId);
      $('#signals_results_id_input').val(data.resultId);
      $('#collapseSix').addClass('in');
    }).fail(function(data) {
      _showErrorMessage('#signals_status_response', data);
    });
  });

  /**************************/
  /* GET SIGNALS JOB STATUS */
  /**************************/
  $('#get_signals_status_btn').click(function(event) {
    var params = {
      jobID: $('#signals_job_id_input').val()
    };
    twxml_module.getJobStatus(event, params, '#signals_content', '#signals_status_response');
  });

  /**************************/
  /* GET SIGNALS JOB RESULT */
  /**************************/
  $('#get_signals_results_btn').click(function(event) {
    var params = {
      jobType: 'signals',
      dsName: $('#signals_ds_name_input').val(),
      jobID: $('#signals_results_id_input').val()
    };
    twxml_module.getJobResults(event, params, '#signals_results_content', '#signals_status_response');
  });

  /********************/
  /* SUBMIT PROFILES  */
  /********************/
  $('#profiles-btn').click(function(event) {
    event.preventDefault();
    var _requestBody = {
      'dsName': $('#profiles_ds_name_input').val(),
      'goal': $('#profiles_ds_goal_select').find(":selected").val(),
      'description': $('#profiles_goal_desc_input').val(),
      'maxDepth': $('#profiles_maxdepth_input').val(),
      'maximize': $('#profiles_maximixe_select').find(":selected").val(),
      'filter': $('#profiles_filter_input').val() || null,
      'minPopulationPercentage': $('#profiles_minPopulationPercentage_input').val(),
      'exclusions': $('#profiles_exclusions_input').val() || []
    };

    $.post('/submit_profiles', _requestBody, function(data, status) {
      $('#collapseFive').addClass('in');
      _showSuccessMessage('#profiles_status_response', status);
      _showServerResponse('#profiles_content', data);
      //$('#profiles_content').html(JSONPrinter.json.prettyPrint(data));
      $('#profiles_job_id_input').val(data.resultId);
      $('#profiles_results_id_input').val(data.resultId);
      $('#collapseEight').addClass('in');
    }).fail(function(data) {
      _showErrorMessage('#profiles_status_response', data);
    });
  });

  /***************************/
  /* GET PROFILES JOB STATUS */
  /***************************/
  $('#get_profiles_status_btn').click(function(event) {
    var params = {
      jobID: $('#profiles_job_id_input').val()
    };
    twxml_module.getJobStatus(event, params, '#profiles_content', '#profiles_status_response');
  });

  /***************************/
  /* GET PROFILES JOB RESULT */
  /***************************/
  $('#get_profiles_results_btn').click(function(event) {
    var params = {
      jobType: 'profilesV2',
      dsName: $('#profiles_ds_name_input').val(),
      jobID: $('#profiles_results_id_input').val()
    };
    twxml_module.getJobResults(event, params, '#profiles_results_content', '#profiles_status_response');
  });

  /********************/
  /* SUBMIT CLUSTERS  */
  /********************/
  $('#clusters-btn').click(function(event) {
    event.preventDefault();
    var _requestBody = {
      'dsName': $('#clusters_ds_name_input').val(),
      'goal':$('#clusters_ds_goal_select').find(":selected").val(),
      'description': $('#clusters_goal_desc_input').val(),
      'hierarchy': $('#clusters_hierarchy_input').val()
    };

    $.post('/submit_clusters', _requestBody, function(data, status) {
      $('#collapseEleven').addClass('in');
      _showSuccessMessage('#clusters_status_response', status);
      _showServerResponse('#clusters_content', data);
      //$('#clusters_content').html(JSONPrinter.json.prettyPrint(data));
      $('#clusters_job_id_input').val(data.resultId);
      $('#clusters_results_id_input').val(data.resultId);
      $('#collapseTwelve').addClass('in');
    }).fail(function(data) {
      _showErrorMessage('#clusters_status_response', data);
    });
  });

  /***************************/
  /* GET CLUSTERS JOB STATUS */
  /***************************/
  $('#get_clusters_status_btn').click(function(event) {
    var params = {
      jobID: $('#clusters_job_id_input').val()
    };
    twxml_module.getJobStatus(event, params, '#clusters_content', '#clusters_status_response');
  });

  /***************************/
  /* GET CLUSTERS JOB RESULT */
  /***************************/
  $('#get_clusters_results_btn').click(function(event) {
    event.preventDefault();
    var params = {
      jobType: 'clusters',
      dsName: $('#clusters_ds_name_input').val(),
      jobID: $('#clusters_results_id_input').val()
    };
    twxml_module.getJobResults(event, params, '#clusters_results_content', '#clusters_status_response');
  });

  /***********************/
  /* SUBMIT PREDICTIONS  */
  /***********************/
  $('#predictions-btn').click(function(event) {
    event.preventDefault();
    var _learners = [];
    var _learningTechnique;
    if ($('#BACKPROP_checkbox').is(':checked')) {
         _learningTechnique = {'learningTechnique': $('#BACKPROP').val(), 'args': {} };
        _learners.push(_learningTechnique);
    }

    if ($('#GRADIENT_BOOST_checkbox').is(':checked')) {
         _learningTechnique = {'learningTechnique': $('#GRADIENT_BOOST').val(), 'args': {} };
        _learners.push(_learningTechnique);
    }
    if ($('#NEURON_DECISION_TREE_checkbox').is(':checked')) {
         _learningTechnique = {'learningTechnique': $('#NEURON_DECISION_TREE').val(), 'args': {} };
        _learners.push(_learningTechnique);
    }

    if ($('#LINEAR_REGRESSION_checkbox').is(':checked')) {
         _learningTechnique = {'learningTechnique': $('#LINEAR_REGRESSION').val(), 'args': {} };
        _learners.push(_learningTechnique);
    }

    var _requestBody = {
      'dsName': $('#predictions_ds_name_input').val(),
      'goal': $('#predictions_ds_goal_select').find(":selected").val(),
      'description': $('#predictions_goal_desc_input').val(),
      'iterativeTrainingRecordSampleSize': $('#predictions_iterativeTrainingRecordSampleSize_input').val(),
      'ensembleTechnique': $('#predictions_ensabletechnique_select').find(":selected").val(),
      'learners': _learners
    };

    $.post('/submit_predictions', _requestBody, function(data, status) {
      _showSuccessMessage('#predictions_status_response', status);
      _showServerResponse('#predictions_content', data);
      //$('#predictions_content').html(JSONPrinter.json.prettyPrint(data));
      $('#predictions_job_id_input').val(data.resultId);
      $('#predictions_results_id_input').val(data.resultId);
      $('#collapseFourteen').addClass('in');
    }).fail(function(data) {
      _showErrorMessage('#predictions_status_response', data);
    });
  });

  /******************************/
  /* GET PREDICTIONS JOB STATUS */
  /******************************/
  $('#get_predictions_status_btn').click(function(event) {
    var params = {
      jobID: $('#predictions_job_id_input').val()
    };
    twxml_module.getJobStatus(event, params, '#predictions_content', '#predictions_status_response');
  });

  /******************************/
  /* GET PREDICTIONS JOB RESULT */
  /******************************/
  $('#get_predictions_results_btn').click(function(event) {
    event.preventDefault();
    var params = {
      jobType: 'predictions',
      dsName: $('#predictions_ds_name_input').val(),
      jobID: $('#predictions_results_id_input').val()
    };
    twxml_module.getJobResults(event, params, '#predictions_results_content', '#predictions_status_response');
  });

});
