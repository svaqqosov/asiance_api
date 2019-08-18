/**
 * Format a mongo duplicated key into a validationError
 *
 * @param {Object} error the error to format in validationError
 */
function formatMongoDupAsValidationError(error) {
  // get name of the duplicated field
  let field = error.errmsg.substring(
    error.errmsg.lastIndexOf('index: ') + 'index: '.length,
    error.errmsg.lastIndexOf(' dup key:')
  );

  field = field.substring(
    field.lastIndexOf('$') + '$'.length,
    field.lastIndexOf('_')
  );
  // console.log(field);

  // get value of duplicated field
  const value = error.errmsg.substring(
    error.errmsg.lastIndexOf('dup key: { : "') + 'dup key: { : "'.length,
    error.errmsg.lastIndexOf('" }')
  );
  // console.log(value);

  return [
    {
      field: [
        field
      ],
      messages: [
        `"${field}" must be a unique (${value})`
      ]
    }
  ];
}

module.exports = {
  formatMongoDupAsValidationError
};
