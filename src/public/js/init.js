
// Plis nie piszcie w jQuery jeśli nie trzeba!
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
  setTimeout(function () {
    alert('oko');
  }, 5000)
})