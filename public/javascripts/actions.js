// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser. Try with another one, e.g. Google Chrome');
}

function setDSInputFields(ds_name) {
  $('#config_dsName_input').val(ds_name);
  $('#upload_dsName_input').val(ds_name);
  $('#filters_ds_name_input').val(ds_name);
  $('#signals_ds_name_input').val(ds_name);
  $('#profiles_ds_name_input').val(ds_name);
  $('#clusters_ds_name_input').val(ds_name);
  $('#predictions_ds_name_input').val(ds_name);
}

function setDSGoalsSelectField(goals) {
  var opts = [];
  $.each(goals, function(idx, obj) {
    opts.push("<option value='" + obj + "'>" + obj + "</option>");
  });
  $('#signals_ds_goal_select').html(opts);
  $('#profiles_ds_goal_select').html(opts);
  $('#clusters_ds_goal_select').html(opts);
  $('#predictions_ds_goal_select').html(opts);
}

function drawRow(rowData) {
  var row = $("<tr />");
  $("#dataSetTable").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
  row.append($('<td class="dsname">' + rowData.name + '</td>'));
  row.append($('<td>' + rowData.description + '</td>'));
  row.append($('<td>' + rowData.optimized + '</td>'));
  row.append($("<td><button class='btn btn-primary btnUseIt' aria-label='Left Align'><span class='glyphicon glyphicon-pencil' aria-hidden='true'/> Use it</button> <button class='btn btn-danger btnDelete' aria-label='Left Align'><span class='glyphicon glyphicon-trash' aria-hidden='true'/> Delete</button></td>"));
}

function countDataSets() {
  $('#rowCount').html("[ # " + ($('#dataSetTable tr').length - 1) + " ]");
}

function showSuccessCodeServerResponse(element, statusCode) {
  $(element).html("<div class='alert alert-success'>Status Code: <b>" + statusCode + "</b></div>");
}

function retrieveGoals(json) {
  goals = [];
  $.each(json, function(idx, obj) {
     if(obj.objective === true) {
       goals.push(obj.fieldName);
     }
   });
   return goals;
}


$(document).ready(function() {
  var twxml_module = TWXMLModule;
  var headers = twxml_module.getHeaders(CONFIGS.neuron_app_id, true);
  $(function() {
    $('[data-toggle="popover"]').popover();
  });

  function useIt(datasetName, errorArea) {
    $.get('/use_dataset', {dsName: datasetName}, function(data) {
      setDSInputFields(datasetName);
      setDSGoalsSelectField(retrieveGoals(data));
    }).fail(function(data) {
      twxml_module.showServerErrorMessage(errorArea, data);
    });
  }

  /*********************/
  /* GET DATA SET LIST */
  /*********************/
  function getDataSetList() {
    $.get('/dataset_list', function(data) {
      for (i = 0; i < data.length; i++) {
        drawRow(data[i], i);
      }
      countDataSets();
    }).fail(function(data) {
      twxml_module.showServerErrorMessage('#dsList_status_response', data);
    });
  }
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
      setDSInputFields(_requestBody.name);
      $('#create_content').html(JSONPrinter.json.prettyPrint(data));
      drawRow(data);
      countDataSets();
      $('#name').val("");
      $('#create_status_response').html("");
      $('#create_status_response').hide();
    }).fail(function(data) {
      twxml_module.showServerErrorMessage('#create_status_response', data);
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

        },
        error: function(xhr, status, error) {
          twxml_module.showErrorMessage('#create_status_response', xhr);
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
      $.post('/configure', _requestBody, function(data) {
          if (typeof data.error === 'undefined') {
            showSuccessCodeServerResponse('#config_status_response', data.status);
            $('#json_content').html(JSONPrinter.json.prettyPrint(data));
            useIt(_requestBody.dsName, '#config_status_response');
          } else {
            console.log('ERRORS on Success : ' + JSON.stringify(data));
          }
      }).fail(function(data) {
        twxml_module.showServerErrorMessage('#json_content', data);
      });
    };

    reader.onerror = function(xhr, status, error) {
      twxml_module.showErrorMessage('#config_status_response', xhr);
    };
  });

  /*******************/
  /* UPLOAD DATA SET */
  /*******************/
  $('#input_csv_file').bootstrapFileInput();
  $('#input_csv_file').on('change', function(event) {
    var _dsName = $('#upload_dsName_input').val();
    var _headers = twxml_module.getHeaders(CONFIGS.neuron_app_id, false);
    var _url = twxml_module.buildURL("/datasets/" + _dsName + "/data");
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
            showSuccessCodeServerResponse('#upload_status_response', textStatus);
            $('#upload_content').html(JSONPrinter.json.prettyPrint(json));
            $('#upload_job_id_input').val(json.resultId);
            $('#collapseFour').addClass('in');
          },
          error: function(xhr, status, error) {
            twxml_module.showServerErrorMessage('#upload_status_response', xhr);
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
    twxml_module.getJobStatus(event, params, '#get_upload_content_status', '#upload_status_response');
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

    $.post('/submit_signals', _requestBody, function(data) {
      $('#collapseFive').addClass('in');
      showSuccessCodeServerResponse('#signals_status_response', textStatus);
      $('#signals_content').html(JSONPrinter.json.prettyPrint(data));
      $('#signals_job_id_input').val(data.resultId);
      $('#signals_results_id_input').val(data.resultId);
      $('#collapseSix').addClass('in');
      $('#collapseSeven').addClass('in');
    }).fail(function(data) {
      twxml_module.showServerErrorMessage('#signals_status_response', data);
    });
  });


  /**************************/
  /* GET SIGNALS JOB STATUS */
  /**************************/
  $('#get_signals_status_btn').click(function(event) {
    var params = {
      jobID: $('#signals_job_id_input').val()
    };
    twxml_module.getJobStatus(event, params, '#get_signals_content_status', '#signals_status_response');
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

    $.post('/submit_profiles', _requestBody, function(data) {
      $('#collapseFive').addClass('in');
      showSuccessCodeServerResponse('#profiles_status_response', textStatus);
      $('#profiles_content').html(JSONPrinter.json.prettyPrint(data));
      $('#profiles_job_id_input').val(data.resultId);
      $('#profiles_results_id_input').val(data.resultId);
      $('#collapseEight').addClass('in');
      $('#collapseNine').addClass('in');
    }).fail(function(data) {
      twxml_module.showServerErrorMessage('#profiles_status_response', data);
    });
  });

  /***************************/
  /* GET PROFILES JOB STATUS */
  /***************************/
  $('#get_profiles_status_btn').click(function(event) {
    var params = {
      jobID: $('#profiles_job_id_input').val()
    };
    twxml_module.getJobStatus(event, params, '#get_profiles_content_status', '#profiles_status_response');
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

    $.post('/submit_clusters', _requestBody, function(data) {
      $('#collapseEleven').addClass('in');
      showSuccessCodeServerResponse('#clusters_status_response', textStatus);
      $('#clusters_content').html(JSONPrinter.json.prettyPrint(data));
      $('#clusters_job_id_input').val(data.resultId);
      $('#clusters_results_id_input').val(data.resultId);
      $('#collapseTwelve').addClass('in');
      $('#collapseThirteen').addClass('in');
    }).fail(function(data) {
      twxml_module.showServerErrorMessage('#clusters_status_response', data);
    });
  });

  /***************************/
  /* GET CLUSTERS JOB STATUS */
  /***************************/
  $('#get_clusters_status_btn').click(function(event) {
    var params = {
      jobID: $('#clusters_job_id_input').val()
    };
    twxml_module.getJobStatus(event, params, '#get_clusters_content_status', '#clusters_status_response');
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

    $.post('/submit_predictions', _requestBody, function(data) {
      showSuccessCodeServerResponse('#predictions_status_response', textStatus);
      $('#predictions_content').html(JSONPrinter.json.prettyPrint(data));
      $('#predictions_job_id_input').val(data.resultId);
      $('#predictions_results_id_input').val(data.resultId);
      $('#collapseFourteen').addClass('in');
      $('#collapseFifteen').addClass('in');
    }).fail(function(data) {
      twxml_module.showServerErrorMessage('#predictions_status_response', data);
    });
  });

  /******************************/
  /* GET PREDICTIONS JOB STATUS */
  /******************************/
  $('#get_predictions_status_btn').click(function(event) {
    var params = {
      jobID: $('#predictions_job_id_input').val()
    };
    twxml_module.getJobStatus(event, params, '#get_predictions_content_status', '#predictions_status_response');
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
