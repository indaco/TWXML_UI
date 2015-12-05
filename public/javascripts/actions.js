// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser. Try with another one, e.g. Google Chrome');
}

function setDSInputFields(ds_name) {
  $('#dataset-name-input').val(ds_name);
  $('#config-dataset-name-input').val(ds_name);
  $('filters_ds_name_input').val(ds_name);
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
  //row.append($('<td><button class="btnDelete">Delete</button></td>'));
}

function countDataSets() {
  $('#rowCount').html("[ # " + ($('#dataSetTable tr').length - 1) + " ]");
}



$(document).ready(function() {
  var twxml_module = TWXMLModule;
  //var headers = twxml_module.getHeaders(CONFIGS.neuron_app_id, true);
  $(function() {
    $('[data-toggle="popover"]').popover();
  });

  function populateDatasetGoals(h, url) {
    twxml_module.doGET(
      h,
      url,
      function(json, textStatus, xhr) {
        setDSGoalsSelectField(twxml_module.retrieveGoals(json));
      },
      function(xhr, status, error) {
        twxml_module.showErrorMessage('#create-status-response', xhr);
      }
    );
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
    }).fail(function(xhr, status, error) {
      twxml_module.showErrorMessage('#create-status-response', xhr);
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
    }).fail( function(xhr, status, error) {
        twxml_module.showErrorMessage('#create-status-response', xhr);
        //console.log(xhr);
    });
  });


  /*******************/
  /* CREATE DATA SET */
  /*******************/
  $('#createbtn').click(function(event) {
    event.preventDefault();

    //var _url = twxml_module.buildURL("/datasets/");
    var _request_body = {
      "name": $('#name').val(),
      "description": $('#description').val(),
      "optimized": $('#optimized').find(":selected").val()
    };
    $.post('/create_dataset', _request_body, function(data) {
      dataset_name = $('#name').val();
      setDSInputFields(dataset_name);
      $('#create-content').html(JSONPrinter.json.prettyPrint(data));
      drawRow(data);
      countDataSets();
    }).fail(function(xhr, status, error) {
      twxml_module.showErrorMessage('#create-status-response', xhr);
    });
  });

  /*******************/
  /* USE DATA SET */
  /*******************/
  $('#dataSetTable').on('click', '.btn.btn-primary.btnUseIt', function(event) {
    event.preventDefault();
    //var parent = $(this).parent("td").parent("tr");
    var _dsName = $(this).closest("tr").find(".dsname").text();
    var _url = twxml_module.buildURL("/datasets/" + _dsName + "/configuration");
    var opts = [];
    twxml_module.doGET(
      headers,
      _url,
      function(json, textStatus, xhr) {
        setDSInputFields(_dsName);
        setDSGoalsSelectField(twxml_module.retrieveGoals(json));
      },
      function(xhr, status, error) {
        twxml_module.showErrorMessage('#create-status-response', xhr);
      }
    );
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
      var _url = twxml_module.buildURL("/datasets/" + _dsName);
      twxml_module.doDELETE(
        headers,
        _url,
        function() {
          parent.animate({
            'background-color': '#fb6c6c'
          }, 300);
        },
        function() {
          parent.fadeOut(300, function() {
            parent.remove();
          });
        },
        function(xhr, status, error) {
          twxml_module.showErrorMessage('#create-status-response', xhr);
        }
      );
    }

  });



  /**********************/
  /* CONFIGURE DATA SET */
  /**********************/
  $('#input-json-file').bootstrapFileInput();
  $('#input-json-file').on('change', function(event) {

    var _dsName = $('#config-dataset-name-input').val();
    var _url = twxml_module.buildURL("/datasets/" + _dsName + "/configuration");
    var _files = event.target.files;
    // Get file content
    var reader = new FileReader();
    reader.readAsText(_files[0], "UTF-8");
    reader.onload = function(evt) {
      content = JSON.parse(evt.target.result);
      $('#json-list').addClass("alert alert-info").html('<ul>' + twxml_module.getDataSetInfo(content) + '</ul>');
      //$('#collapseTwo').addClass('in');
      twxml_module.doPOST(
        headers,
        _url,
        JSON.parse(evt.target.result),
        function(json, textStatus, xhr) {
          $('#config-status-response').html("<div class='alert alert-success'>Status Code: <b>" + textStatus + "</b></div>");
          $('#json-content').html(JSONPrinter.json.prettyPrint(json));
          populateDatasetGoals(headers, _url);
        },
        function(xhr, status, error) {
          twxml_module.showServerResponse('#create-content', xhr);
          //$('#create-content').html("<div class='alert alert-danger'><h4>Error creating data set " + error.message + "reading file</h4></div>");
        }
      );
    };
    reader.onerror = function(xhr, status, error) {
      twxml_module.showErrorMessage('#config-status-response', xhr);
    };
  });

  /*******************/
  /* UPLOAD DATA SET */
  /*******************/
  $('#input-csv-file').bootstrapFileInput();
  $('#input-csv-file').on('change', function(event) {
    var _dsName = $('#dataset-name-input').val();
    var _headers = twxml_module.getHeaders(CONFIGS.neuron_app_id, false);
    var _url = twxml_module.buildURL("/datasets/" + _dsName + "/data");
    var _files = event.target.files;

    $('#csv-list').addClass("alert alert-info").html('<ul>' + twxml_module.getFileInfo(_files).join('') + '</ul>');

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
            $('#upload_status_response').html("<div class='alert alert-success'>Status Code: <b>" + textStatus + "</b></div>");
            $('#upload_content').html(JSONPrinter.json.prettyPrint(json));
            $('#upload_job_id_input').val(json.resultId);
            $('#collapseFour').addClass('in');
          },
          error: function(xhr, status, error) {
            twxml_module.showErrorMessage('#upload_status_response', xhr);
          }
        });
      }

    }
  });

  /**********************************/
  /* GET UPLOAD DATA SET JOB STATUS */
  /**********************************/
  $('#get_upload_status_btn').click(function(event) {
    twxml_module.getJobStatus(event, '#upload_job_id_input', '#get_upload_content_status', '#upload_status_response');
  });

  /*******************/
  /* SUBMIT SIGNALS  */
  /*******************/
  $('#signals-btn').click(function(event) {
    event.preventDefault();
    var _dsName = $('#signals_ds_name_input').val();
    var _url = twxml_module.buildURL("/datasets/" + _dsName + "/signals");
    var _request_body = {
      'goal': $('#signals_ds_goal_select').find(":selected").val(),
      'description': $('#signals_goal_desc_input').val(),
      'maxAtATime': $('#signals_max_input').val()
    };

    twxml_module.doPOST(
      headers,
      _url,
      _request_body,
      function(json, textStatus, xhr) {
        $('#collapseFive').addClass('in');
        $('#signals_status_response').html("<div class='alert alert-success'>Status Code: <b>" + textStatus + "</b></div>");
        $('#signals_content').html(JSONPrinter.json.prettyPrint(json));
        $('#signals_job_id_input').val(json.resultId);
        $('#signals_results_id_input').val(json.resultId);
        $('#collapseSix').addClass('in');
        $('#collapseSeven').addClass('in');
      },
      function(xhr, status, error) {
        twxml_module.showErrorMessage('#signals_status_response', xhr);
        //showErrorMessage('#signals_status_response', xhr);
      }
    );
  });


  /**************************/
  /* GET SIGNALS JOB STATUS */
  /**************************/
  $('#get_signals_status_btn').click(function(event) {
    twxml_module.getJobStatus(event, '#signals_job_id_input', '#get_signals_content_status', '#signals_status_response');
  });

  /**************************/
  /* GET SIGNALS JOB RESULT */
  /**************************/
  $('#get_signals_results_btn').click(function(event) {
    twxml_module.getJobResults(event, '#signals_ds_name_input', '#signals_results_id_input', 'signals', '#signals_results_content', '#signals_status_response');
  });

  /********************/
  /* SUBMIT PROFILES  */
  /********************/
  $('#profiles-btn').click(function(event) {
    event.preventDefault();
    var _dsName = $('#profiles_ds_name_input').val();
    var _url = twxml_module.buildURL("/datasets/" + _dsName + "/profilesV2");
    var _request_body = {
      'goal': $('#profiles_ds_goal_select').find(":selected").val(),
      'description': $('#profiles_goal_desc_input').val(),
      'maxDepth': $('#profiles_maxdepth_input').val(),
      'maximize': $('#profiles_maximixe_select').find(":selected").val(),
      'filter': $('#profiles_filter_input').val() || null,
      'minPopulationPercentage': $('#profiles_minPopulationPercentage_input').val(),
      'exclusions': $('#profiles_exclusions_input').val() || []
    };

    twxml_module.doPOST(
      headers,
      _url,
      _request_body,
      function(json, textStatus, xhr) {
        $('#collapseFive').addClass('in');
        $('#profiles_status_response').html("<div class='alert alert-success'>Status Code: <b>" + textStatus + "</b></div>");
        $('#profiles_content').html(JSONPrinter.json.prettyPrint(json));
        $('#profiles_job_id_input').val(json.resultId);
        $('#profiles_results_id_input').val(json.resultId);
        $('#collapseEight').addClass('in');
        $('#collapseNine').addClass('in');
      },
      function(xhr, status, error) {
        twxml_module.showErrorMessage('#profiles_status_response', xhr);
      }
    );
  });

  /***************************/
  /* GET PROFILES JOB STATUS */
  /***************************/
  $('#get_profiles_status_btn').click(function(event) {
    twxml_module.getJobStatus(event, '#profiles_job_id_input', '#get_profiles_content_status', '#profiles_status_response');
  });

  /***************************/
  /* GET PROFILES JOB RESULT */
  /***************************/
  $('#get_profiles_results_btn').click(function(event) {
    twxml_module.getJobResults(event, '#profiles_ds_name_input', '#profiles_results_id_input', 'profilesV2', '#profiles_results_content', '#profiles_status_response');
  });

  /********************/
  /* SUBMIT CLUSTERS  */
  /********************/
  $('#clusters-btn').click(function(event) {
    event.preventDefault();
    var _dsName = $('#clusters_ds_name_input').val();
    var _url = twxml_module.buildURL("/datasets/" + _dsName + "/clusters");
    var _request_body = {
      'goal':$('#clusters_ds_goal_select').find(":selected").val(),
      'description': $('#clusters_goal_desc_input').val(),
      'hierarchy': [$('#clusters_hierarchy_input').val()]
    };

    twxml_module.doPOST(
      headers,
      _url,
      _request_body,
      function(json, textStatus, xhr) {
        $('#collapseEleven').addClass('in');
        $('#clusters_status_response').html("<div class='alert alert-success'>Status Code: <b>" + textStatus + "</b></div>");
        $('#clusters_content').html(JSONPrinter.json.prettyPrint(json));
        $('#clusters_job_id_input').val(json.resultId);
        $('#clusters_results_id_input').val(json.resultId);
        $('#collapseTwelve').addClass('in');
        $('#collapseThirteen').addClass('in');
      },
      function(xhr, status, error) {
        twxml_module.showErrorMessage('#profiles_status_response', xhr);
      }
    );
  });

  /***************************/
  /* GET CLUSTERS JOB STATUS */
  /***************************/
  $('#get_clusters_status_btn').click(function(event) {
    twxml_module.getJobStatus(event, '#clusters_job_id_input', '#get_clusters_content_status', '#clusters_status_response');
  });

  /***************************/
  /* GET CLUSTERS JOB RESULT */
  /***************************/
  $('#get_clusters_results_btn').click(function(event) {
    event.preventDefault();
    var _dsName = $('#clusters_ds_name_input').val();
    var _job_id_value = $('#clusters_results_id_input').val();
    var _url = twxml_module.buildURL("/datasets/" + _dsName + "/clusters");
    twxml_module.doGET(
      headers,
      _url,
      function(json) {
        $('#clusters_results_content').html(JSONPrinter.json.prettyPrint(json));
      },
      function(xhr, status, error) {
        twxml_module.showErrorMessage('#clusters_status_response', xhr);
      }
    );
  });

  /***********************/
  /* SUBMIT PREDICTIONS  */
  /***********************/
  $('#predictions-btn').click(function(event) {
    event.preventDefault();
    var _dsName = $('#predictions_ds_name_input').val();
    var _url = twxml_module.buildURL("/datasets/" + _dsName + "/prediction");
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

    var _request_body = {
      'goal': $('#predictions_ds_goal_select').find(":selected").val(),
      'description': $('#predictions_goal_desc_input').val(),
      'iterativeTrainingRecordSampleSize': $('#predictions_iterativeTrainingRecordSampleSize_input').val(),
      'ensembleTechnique': $('#predictions_ensabletechnique_select').find(":selected").val(),
      'learners': _learners
    };

    twxml_module.doPOST(
      headers,
      _url,
      _request_body,
      function(json, textStatus, xhr) {
        $('#predictions_status_response').html("<div class='alert alert-success'>Status Code: <b>" + textStatus + "</b></div>");
        $('#predictions_content').html(JSONPrinter.json.prettyPrint(json));
        $('#predictions_job_id_input').val(json.resultId);
        $('#predictions_results_id_input').val(json.resultId);
        $('#collapseFourteen').addClass('in');
        $('#collapseFifteen').addClass('in');
      },
      function(xhr, status, error) {
        twxml_module.showErrorMessage('#profiles_status_response', xhr);
      }
    );
  });

  /******************************/
  /* GET PREDICTIONS JOB STATUS */
  /******************************/
  $('#get_predictions_status_btn').click(function(event) {
    twxml_module.getJobStatus(event, '#predictions_job_id_input', '#get_predictions_content_status', '#predictions_status_response');
  });

  /******************************/
  /* GET PREDICTIONS JOB RESULT */
  /******************************/
  $('#get_predictions_results_btn').click(function(event) {
    event.preventDefault();
    var _dsName = $('#predictions_ds_name_input').val();
    var _job_id_value = $('#predictions_results_id_input').val();
    var _url = twxml_module.buildURL("/datasets/" + _dsName + "/clusters");
    twxml_module.doGET(
      headers,
      _url,
      function(json) {
        $('#predictions_results_content').html(JSONPrinter.json.prettyPrint(json));
      },
      function(xhr, status, error) {
        twxml_module.showErrorMessage('#predictions_status_response', xhr);
      }
    );
  });

});
