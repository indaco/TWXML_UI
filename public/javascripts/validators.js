$(document).ready(function() {

  /***********************************/
  /* CREATE DATA SET FORM VALIDATION */
  /***********************************/
  $('#createform').formValidation({
      framework: 'bootstrap',
      icon: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
        create_dsName: {
          validators: {
            notEmpty: {
              message: 'The name is required'
            },
            stringLength: {
              min: 4,
              max: 30,
              message: 'The name must be more than 4 and less than 30 characters long'
            },
            regexp: {
              regexp: /^[a-zA-Z0-9_]+$/,
              message: 'The name can only consist of alphabetical, number and underscore'
            }
          }
        }
      }
    })
    .on('success.field.fv', function(e, data) {
      if (data.fv.getInvalidFields().length > 0) { // There is invalid field
        data.fv.disableSubmitButtons(true);
      }
    });

  /***************************/
  /* FILTERS FORM VALIDATION */
  /***************************/
  $('#filtersform').formValidation({
    framework: 'bootstrap',
    icon: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {}
  });

  /***************************/
  /* SIGNALS FORM VALIDATION */
  /***************************/
  $('#signalsform').formValidation({
    framework: 'bootstrap',
    icon: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      signals_max_input: {
        validators: {
          notEmpty: {
            message: 'The max at a time is required'
          },
          numeric: {
            message: 'The max at a time can only consist of numbers'
          },
          between: {
            min: 1,
            max: 100,
            message: "The max at a time must a positive integer number"
          }
        }
      }
    }
  });


  /****************************/
  /* PROFILES FORM VALIDATION */
  /****************************/
  $('#profilesform').formValidation({
    framework: 'bootstrap',
    icon: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      profiles_maxdepth_input: {
        validators: {
          notEmpty: {
            message: 'The max depth is required'
          },
          regexp: {
            regexp: /^([1-9]|10)$/,
            message: 'The max depth can only consist of positive integer numbers'
          }
        }
      },
      profiles_minPopulationPercentage_input: {
        validators: {
          notEmpty: {
            message: 'The min Population Percentage is required'
          },
          between: {
            min: 0,
            max: 1,
            message: 'The min Population Percentage must be between 0 and 1'
          }
        }
      }
    }
  });

  /****************************/
  /* CLUSTERS FORM VALIDATION */
  /****************************/
  $('#clustersform').formValidation({
    framework: 'bootstrap',
    icon: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      clusters_hierarchy_input: {
        validators: {
          notEmpty: {
            message: 'The hierarchy is required'
          },
          regexp: {
            regexp: /^([2-9]|10)$/,
            message: 'The max at a time can only consist of positive integer numbers'
          }
        }
      }
    }
  });


  /*******************************/
  /* PREDICTIONS FORM VALIDATION */
  /*******************************/
  $('#predictionsform').formValidation({
    framework: 'bootstrap',
    icon: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {}
  });


});
