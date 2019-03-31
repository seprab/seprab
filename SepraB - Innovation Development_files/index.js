
function init()
{
  //alert('started');
  espanol();
}
function ingles()
{
  //alert('ingles');
  document.getElementById('en_Content').style.display = 'initial';
  document.getElementById('en_Firma').style.display = 'initial';
  document.getElementById('en_Derechos').style.display = 'initial';

  document.getElementById('es_Content').style.display = 'none';
  document.getElementById('es_Firma').style.display = 'none';
  document.getElementById('es_Derechos').style.display = 'none';
}
function espanol()
{
  //alert('espanol');
  document.getElementById('es_Firma').style.display = 'initial';
  document.getElementById('es_Content').style.display = 'initial';
  document.getElementById('es_Derechos').style.display = 'initial';

  document.getElementById('en_Firma').style.display = 'none';
  document.getElementById('en_Content').style.display = 'none';
  document.getElementById('en_Derechos').style.display = 'none';
}
