$(document).ready(function(){
  var dataKriteria;
  var dataAlternatif;
  var nKriteria;
  var nAlternatif;
  var dataMatriksNilai;
  var dataBobot;

  // KRITERIA
  $('.tambah-kriteria').on('click',function(){
    var itr = $('#kriteria>tbody>tr:last').attr('id');
    var itrs = parseFloat(itr,10) + 1;
    $('#kriteria').append('<tr id="'+itrs+'"></tr>"');
    $('#kriteria #'+itrs).html('<td><input type="text" class="form-control form-control-sm" placeholder="Kode" name="kode-kriteria"></td><td><input type="text" class="form-control form-control-sm" placeholder="Nama Kriteria" name="nama-kriteria"></td><td><select class="form-control form-control-sm" name="sifat-kriteria"><option selected disable hidden>Sifat</option><option value="1">Benefit</option><option value="0">Cost</option></select></td><td><span class="hapus-kriteria btn btn-danger btn-sm btn-block"><i class="fa fa-minus"></i></span></td>');
    $('.hapus-kriteria').on('click',function(){
      $(this).closest('tr').remove();
    });
  });
  
  // ALTERNATIF
  $('.tambah-alternatif').on('click',function(){
    var itr = $('#alternatif>tbody>tr:last').attr('id');
    var itrs = parseFloat(itr,10) + 1;
    $('#alternatif').append('<tr id="'+itrs+'"></tr>"');
    $('#alternatif #'+itrs).html('<td><input type="text" class="form-control form-control-sm" placeholder="Kode" name="kode-alternatif"></td><td><input type="text" class="form-control form-control-sm" placeholder="Nama Alternatif" name="nama-alternatif"></td><td><span class="hapus-alternatif btn btn-danger btn-sm btn-block"><i class="fa fa-minus"></i></span></td>');
    $('.hapus-alternatif').on('click',function(){
      $(this).closest('tr').remove();
    });
  });

  
  $('#bf').click(function(){
    $('#first').fadeOut(500,function(){
      
      // DATA KRITERIA
      dataKriteria = new Array();
      $('#kriteria tbody tr').each(function(row, tr){
        dataKriteria[row] = new Array();
        dataKriteria[row]['kode'] = $($(tr).find('td:eq(0) input')).val();
        dataKriteria[row]['nama'] = $($(tr).find('td:eq(1) input')).val();
        dataKriteria[row]['sifat'] = $($(tr).find('td:eq(2) select option:selected')).val();
      });
      console.log("data kriteria");
      console.log(dataKriteria);
      
      // DATA ALTERNATIF
      dataAlternatif = new Array();
      $('#alternatif tbody tr').each(function(row,tr){
        dataAlternatif[row] = new Array();
        dataAlternatif[row]['kode'] = $($(tr).find('td:eq(0) input')).val();
        dataAlternatif[row]['nama'] = $($(tr).find('td:eq(1) input')).val();
      });
      console.log("data alternatif");
      console.log(dataAlternatif);
      
      // MATRIKS NILAI
      nKriteria = parseFloat($('#kriteria tbody tr').length,10);
      nAlternatif = parseFloat($('#alternatif tbody tr').length,10);
      $('#matriks-nilai>thead .nilai').attr("colspan",nKriteria);
      for(var i=0; i < nAlternatif; i++){
        $('#matriks-nilai tbody').append('<tr id="'+i+'"></tr>"');
        $('#matriks-nilai tbody #'+i).html('<th>'+dataAlternatif[i]['kode']+'</th>');
        $('#matriks-nilai thead').append('<tr></tr>"');
        for(var j=0; j < nKriteria; j++){
          if(i==0){
            $('#matriks-nilai thead tr:last').append('<th>'+dataKriteria[j]['kode']+'</tr>');
          }
          $('#matriks-nilai #'+i).append('<td><input type="number" step="0.01" class="form-control form-control-sm"></td>');
        }
      }
      
      // BOBOT
      for(var i=0; i< nKriteria; i++){
        $('#bobot').append('<tr></tr>');
        $('#bobot tbody tr:last').html('<th>W'+i+'</th><td><input type="number" class="form-control form-control-sm"></td>');
      }
      
      $('#second').fadeIn(500);
    });
  });

  $('#bs').click(function(){
    $('#second').fadeOut(500,function(){
      
      // DATA MATRIKS NILAI
      dataMatriksNilai = new Array();
      $('#matriks-nilai tbody tr').each(function(row, tr){
        dataMatriksNilai[row] = new Array();
        for(var i=0; i < nKriteria; i++){
          dataMatriksNilai[row][i] = $($(tr).find('td:eq('+i+') > input')).val();
        }
      });
      console.log("data matriks nilai");
      console.log(dataMatriksNilai);
      
      // DATA BOBOT
      dataBobot = new Array();
      $('#bobot tbody tr').each(function(row, tr){
        dataBobot[row] = new Array();
        dataBobot[row]['kode'] = $($(tr).find('td:eq(0)')).val();
        dataBobot[row]['nilai'] = $($(tr).find('td:eq(0) input')).val();
      });
      console.log("data bobot");
      console.log(dataBobot);
      
      // NORMALISASI
      var totalKriteria = new Array();
      for(var i=0; i<nKriteria; i++){
        totalKriteria[i] = 0;
        for(var j=0; j<nAlternatif; j++){
          totalKriteria[i] += Math.pow(dataMatriksNilai[j][i],2);
        }
      }
      console.log("total kriteria");
      console.log(totalKriteria);

      for(var i=0; i<nKriteria; i++){
        for(var j=0; j<nAlternatif; j++){
          dataMatriksNilai[j][i] /= Math.sqrt(totalKriteria[i]);
        }
      }
      console.log("data matriks nilai");
      console.log(dataMatriksNilai);
      
      $('#normalisasi>thead .nilai').attr("colspan",nKriteria);
      for(var i=0; i < nAlternatif; i++){
        $('#normalisasi tbody').append('<tr id="'+i+'"></tr>"');
        $('#normalisasi tbody #'+i).html('<th>'+dataAlternatif[i]['kode']+'</th>');
        $('#normalisasi thead').append('<tr></tr>"');
        for(var j=0; j < nKriteria; j++){
          if(i==0){
            $('#normalisasi thead tr:last').append('<th>'+dataKriteria[j]['kode']+'</tr>');
          }
          $('#normalisasi #'+i).append('<td>'+dataMatriksNilai[i][j].toFixed(4)+'</td>');
        }
      }
      
      // NORMAL BOBOT
      for(var i=0; i<nAlternatif; i++){
        for(var j=0; j<nKriteria; j++){
          dataMatriksNilai[i][j] *= dataBobot[j]['nilai'];
        }
      }
      console.log("data matriks nilai");
      console.log(dataMatriksNilai);
      
      $('#bobot-normal>thead .nilai').attr("colspan",nKriteria);
      for(var i=0; i < nAlternatif; i++){
        $('#bobot-normal tbody').append('<tr id="'+i+'"></tr>"');
        $('#bobot-normal tbody #'+i).html('<th>'+dataAlternatif[i]['kode']+'</th>');
        $('#bobot-normal thead').append('<tr></tr>"');
        for(var j=0; j < nKriteria; j++){
          if(i==0){
            $('#bobot-normal thead tr:last').append('<th>'+dataKriteria[j]['kode']+'</tr>');
          }
          $('#bobot-normal #'+i).append('<td>'+dataMatriksNilai[i][j].toFixed(4)+'</td>');
        }
      }
      
      // DATA SOLUSI POSITIF
      var sPos = new Array();
      for(var i=0; i<nKriteria; i++){
        sPos[i] = dataMatriksNilai[0][i];
      }
      for(var j=0; j<nKriteria; j++){
        for(var i=0; i<nAlternatif; i++){
          if(dataKriteria[j]['sifat'] == 1){
            sPos[j] = Math.max(sPos[j],dataMatriksNilai[i][j]);
          }else{
            sPos[j] = Math.min(sPos[j],dataMatriksNilai[i][j]);
          }
        }
      }
      console.log("spos");
      console.log(sPos);
      
      // DATA SOLUSI NEGATIF
      var sNeg = new Array();
      for(var i=0; i<nKriteria; i++){
        sNeg[i] = dataMatriksNilai[0][i];
      }
      for(var j=0; j<nKriteria; j++){
        for(var i=0; i<nAlternatif; i++){
          if(dataKriteria[j]['sifat'] == 1){
            sNeg[j] = Math.min(sNeg[j],dataMatriksNilai[i][j]);
          }else{
            sNeg[j] = Math.max(sNeg[j],dataMatriksNilai[i][j]);
          }
        }
      }
      console.log("sneg");
      console.log(sNeg);
      
      // SOLUSI
      for(var i=0; i< nKriteria; i++){
        $('#solusi tbody').append('<tr></tr>');
        $('#solusi tbody tr:last').html('<td>y'+i+'+</td><td>'+sPos[i].toFixed(4)+'</td><td>y'+i+'-</td><td>'+sNeg[i].toFixed(4)+'</td>');
      }
      
      // JARAK SOLUSI POSITIF
      var jPos = new Array();
      var tjPos = new Array();
      for(var i=0; i<nAlternatif; i++){
        tjPos[i] = 0;
        for(var j=0; j<nKriteria; j++){
          tjPos[i] += Math.pow((dataMatriksNilai[i][j] - sPos[j]),2);
        }
        jPos[i] = Math.sqrt(tjPos[i]);
      }
      console.log("jpos");
      console.log(jPos);
      console.log("tjpos");
      console.log(tjPos);
      
      // JARAK SOLUSI NEGATIF
      var jNeg = new Array();
      var tjNeg = new Array();
      for(var i=0; i<nAlternatif; i++){
        tjNeg[i] = 0;
        for(var j=0; j<nKriteria; j++){
          tjNeg[i] += Math.pow((dataMatriksNilai[i][j] - sNeg[j]),2);
        }
        jNeg[i] = Math.sqrt(tjNeg[i]);
      }
      console.log("jneg");
      console.log(jNeg);
      console.log("tjneg");
      console.log(tjNeg);
      
      // JARAK
      for(var i=0; i< nAlternatif; i++){
        $('#jarak tbody').append('<tr></tr>');
        $('#jarak tbody tr:last').html('<td>D'+i+'+</td><td>'+jPos[i].toFixed(4)+'</td><td>D'+i+'-</td><td>'+jNeg[i].toFixed(4)+'</td>');
      }
      
      // NILAI PREFERENSI
      var pref = new Array();
      var prefs = new Array();

      for(var i=0; i<nAlternatif; i++){
        pref[i] = new Array();
        pref[i]['id'] = i;
        pref[i]['nilai'] = jNeg[i] / (jPos[i] + jNeg[i]);
        pref[i]['rank'] = (i+1);
        prefs[i] = new Array();
        prefs[i]['id'] = pref[i]['id'];
        prefs[i]['nilai'] = pref[i]['nilai'];
        prefs[i]['rank'] = pref[i]['rank'];
      }
      console.log("pref");
      console.log(pref);
      
      // RANKING
      for(var i=0; i<nAlternatif; i++){
        let helper1 = prefs[i]['nilai'];
        let helper3 = prefs[i]['id'];
        for(var j = i - 1; j>=0 && prefs[j]['nilai']<helper1; j--){
          prefs[j+1]['nilai'] = prefs[j]['nilai'];
          prefs[j+1]['id'] = prefs[j]['id'];
        }
        prefs[j+1]['nilai'] = helper1;
        prefs[j+1]['id'] = helper3;
      }
      console.log("prefs");
      console.log(prefs);

      for(var i=0; i<nAlternatif; i++){
        for(var j=0; j<nAlternatif; j++){
          if(pref[i]['nilai']==prefs[j]['nilai']){
            console.log(pref[i]['rank'] + " " + prefs[j]['rank']);
            pref[i]['rank'] = prefs[j]['rank'];
            console.log(pref[i]['rank'] + " " + prefs[j]['rank']);
          }
        }
      }
      console.log("pref");
      console.log(pref);
      
      // PREFERENSI
      for(var i=0; i< nAlternatif; i++){
        $('#preferensi tbody').append('<tr></tr>');
        $('#preferensi tbody tr:last').html('<td>V'+pref[i]['id']+'</td><td>'+pref[i]['nilai'].toFixed(4)+'</td><td>'+pref[i]['rank']+'</td>');
      }
      
      $('#tujuan').html($('#tujuan-input').val())
      $('#pref').html("V"+prefs[0]['id']);
      $('#pref-val').html(prefs[0]['nilai'].toFixed(4));
      $('#alt-id').html(dataAlternatif[prefs[0]['id']]['kode']);
      $('#alt-name').html(dataAlternatif[prefs[0]['id']]['nama']);
      $('#third').fadeIn(500);
    });
  });

  $('#bt').click(function(){
    $('#third').fadeOut(500,function(){
      $('#first input').val("");
      $('#tujuan-input').val("");
      $('#kriteria>tbody').children('tr:not(:first)').remove();
      $('#kriteria>tbody>td>select option:first').prop('selected',true);
      $('#alternatif>tbody').children('tr:not(:first)').remove();
      $('#matriks-nilai>thead').children('tr:not(:first)').remove();
      $('#matriks-nilai>tbody').children('tr').remove();
      $('#normalisasi>thead').children('tr:not(:first)').remove();
      $('#normalisasi>tbody').children('tr').remove();
      $('#bobot-normal>thead').children('tr:not(:first)').remove();
      $('#bobot-normal>tbody').children('tr').remove();
      $('#bobot>tbody').children('tr').remove();
      $('#first').fadeIn(500);
    });
  });

});