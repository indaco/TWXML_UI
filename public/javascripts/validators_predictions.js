/******************************/
/* PREDICTION FORM VALIDATION */
/******************************/
$('#predictionsform').formValidation({
    framework: 'bootstrap',
    icon: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      predictions_ds_name_input: {
        validators: {
          notEmpty: {
            message: 'The data set name is required'
          },
          stringLength: {
            min: 4,
            max: 30,
            message: 'The dataset name must be more than 4 and less than 30 characters long'
          },
          regexp: {
            regexp: /^[a-zA-Z0-9_]+$/,
            message: 'The data set name can only consist of alphabetical, number and underscore'
          }
        }
      },
      predictions_ds_goal_input: {
        validators: {
          notEmpty: {
            message: 'The goal is required'
          },
          regexp: {
            regexp: /^[a-zA-Z0-9_]+$/,
            message: 'The goal can only consist of alphabetical, number and underscore'
          }
        }

      },
      predictions_iterativeTrainingRecordSampleSize_input: {
        validators: {
          notEmpty: {
            message: 'The Iterative Training Record Sample Size is required'
          },
          regexp: {
            regexp: /^([1-9]|10)$/,
            message: 'The Iterative Training Record Sample Size can only consist of positive integer numbers'
          }
        }
      },
      predictions_learningcomplexity_input: {
        validators: {
          notEmpty: {
            message: 'The learning complexity is required'
          },
          regexp: {
            regexp: /^([1-6])$/,
            message: 'The learning complexity can only consist of positive integer number in range [1, 6]'
          }
        }
      },

      predictions_learners_select: {
        validators: {
          notEmpty: {
            message: 'The Learners are required. You can include one or more of the learning techniques, but you must have at least one defined'
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
