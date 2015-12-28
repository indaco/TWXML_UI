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

function _showInfoMessage(element, msg) {
  $(element).html("<div class='alert alert-info'><b>Dataset Configuration Info:</b>" + msg + "</div>");
  $(element).show();
}

function _showErrorMessage(element, data) {
  var msg = "";
  if (data.responseJSON.errorMessage != undefined) {
    msg = "<div class='alert alert-danger'> " +
      "Error: <br/><b>" + data.responseJSON.errorMessage +
      "</b> <br/>( ID: " + data.responseJSON.errorId + " )</div>";
  } else {
    msg = "<div class='alert alert-danger'> Error: <br/><b>" + JSON.stringify(data.responseText) + "</b></div>";
  }

  $(element).html(msg);
  $(element).show();
}

function _buildURL(path) {
  var _ssl = (_ssl == CONFIGS.ssl);
  var protocol = (_ssl) ? "https" : "http";
  return protocol + "://" + CONFIGS.host + ":" + CONFIGS.port + "/1.0" + path;
}

function _setDSInputFields(ds_name) {
  $('#config_dsName_input').val(ds_name);
  $('#upload_dsName_input').val(ds_name);
  $('#optimize_dsName_input').val(ds_name);
  $('#filters_ds_name_input').val(ds_name);
  $('#signals_ds_name_input').val(ds_name);
  $('#profiles_ds_name_input').val(ds_name);
  $('#clusters_ds_name_input').val(ds_name);
  $('#predictions_ds_name_input').val(ds_name);
}

function _setDSFeaturesForFilters(goals) {
  var opts = [];
  $.each(goals, function(idx, obj) {
    opts.push("<option value='" + obj + "'>" + obj + "</option>");
  });
  $('#dataset_features_select').html(opts);
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
  row.append($("<td><button class='btn btn-primary btnUseIt' aria-label='Left Align'><span class='glyphicon glyphicon-edit' aria-hidden='true'/> Use it</button> <button class='btn btn-danger btnDelete' aria-label='Left Align'><span class='glyphicon glyphicon-trash' aria-hidden='true'/> Delete</button></td>"));
}

function _drawFilterRow(rowData) {
  var row = $("<tr />");
  $("#filtersTable").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
  row.append($('<td class="filterConditionName">' + rowData.fieldName + '</td>'));
  row.append($('<td>' + rowData.expression + '</td>'));
  row.append($('<td>' + rowData.type + '</td>'));
  row.append($("<td><button class='btn btn-primary btnEditFilterCondition' aria-label='Left Align'><span class='glyphicon glyphicon-pencil' aria-hidden='true'/> Edit</button> <button class='btn btn-danger btnDeleteFilterCondition' aria-label='Left Align'><span class='glyphicon glyphicon-remove' aria-hidden='true'/> Delete</button></td>"));
}

function _clearCreationFields() {
  $('#create_dsName').val("");
  $('#description').val("");
}

function _clearFilterFields() {
  $('#dataset_features_select').prop('selectedIndex', 0);
  $('#filter_expression').val("");
  $('#filter_type_select').prop('selectedIndex', 0);
}

function _getDataSetInfo(json) {
  return '<li>No. Features: <strong>' + json.length + '</strong></li>'
        + '<li> Goals: <strong>' + _retrieveGoals(json) + '</strong></li>';
}

function _retrieveFeatures(json) {
  features = [];
  $.each(json, function(idx, obj) {
    features.push(obj.fieldName);
   });
   return features;
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
  $.get('/actions/use', {dsName: datasetName}, function(data) {
    _setDSInputFields(datasetName);
    _setDSFeaturesForFilters(_retrieveFeatures(data));
    _setDSGoalsSelectField(_retrieveGoals(data));
  }).fail(function(data) {
    _showErrorMessage(errorArea, data);
  });
}
