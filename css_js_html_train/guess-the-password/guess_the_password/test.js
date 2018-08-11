function toggleClasses(selection, ...classNames) {

    classNames.forEach(name => {
      var classIsSet = selection.classed(name);
      selection.classed(name, !classIsSet);
    })
}