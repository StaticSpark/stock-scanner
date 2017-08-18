export default ( output, i, func ) => {
  return output.slice( i, i + 10 )
    .map( ( obj ) => {
      return obj.Symbol;
    })
    .join(',');
};
