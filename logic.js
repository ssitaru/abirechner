// logic.js -- Abirechner '13 Logic JS
// (C) 2012 Sebastian Sitaru <s.sitaru@gmx.de>

Array.prototype.foreach = function( callback ) {
  for( var k=0; k<this .length; k++ ) {
    callback( k, this[ k ] );
  }
}


function log(s)
{
    $("#pre_log").append(s+'\n');
}

function getPktForHJ(s_id)
{
  var ret = [];
    
  for(var i = 1; i <= 4; i++)
  {
      ret[i-1] = $('#'+s_id+i+' option:selected').text();
  }
    
  return ret;
}

function getCheckboxesForHJ(s_id)
{
  var ret = [];
  
  for(var i = 1; i <= 4; i++)
  {
      ret[ret.length] = $('#'+s_id+i+'_include').attr('checked');
  }
  
  return ret;
}

function isFachIn(ar, fach)
{
  var ret = {result: false, i: false};
  
  for(var i = 0; i < ar.length; i++)
  {
      if(ar[i].name == fach)
      {
        ret.result = true;
        ret.i = i;
      }
  }
  
  return ret;
}

function countTrue(ar){
  var k = 0;
  for(var i = 0; i < ar.length; i++) {
    if(ar[i] != undefined) k++;
  }
  
  return k;
}


function BlockI(root) {
    this.root = root;
    this.kernfacher = [];
    nebenfacher = [];
}

BlockI.prototype.check = function() {
    this.calc();
}

BlockI.prototype.read = function() {
  
}

BlockI.prototype.calc = function() {
  $("#pre_log").html('');
  // re-enable all previously disabled control elements
  $('._recalc_on_change').removeAttr('disabled');
  $('select').removeAttr('disabled');
  
  var kernfacher = [];
  var nebenfacher = [];
  
  
  var res_de = getPktForHJ('kres_de');
    var res_ma = getPktForHJ('kres_ma');
    var res_fs = getPktForHJ('kres_fs');
    var res_k1 = getPktForHJ('kres_k1-');
    var res_k2 = getPktForHJ('kres_k2-');
    
    // read points
    kernfacher[0] = {
        name: 'de',
        res: res_de
    };
    kernfacher[1] = {
        name: 'ma',
        res: res_ma
    };
    kernfacher[2] = {
        name: $("#kfach_fs option:selected").val(),
        res: res_fs
    };
    kernfacher[3] = {
        name: $("#kfach_k1 option:selected").val(),
        res: res_k1
    };
    kernfacher[4] = {
        name: $("#kfach_k2 option:selected").val(),
        res: res_k2
    };
    $("._nebenfach").each(function(){
        var id = ''+$(this).find('select.sel_punkte:first-child').attr('id');
        if($(this).find('select.sel_neben option:selected').val() != "<leer>"){ // if this is not a <leer> entry
          nebenfacher[nebenfacher.length] = {
              name: $(this).find('select.sel_neben option:selected').val(),
              res: getPktForHJ(id.slice(0, -1)),
              include: getCheckboxesForHJ(id.slice(0, -1))
          };
        }
    });
    
    // check the stuff based on the Abi13 Leitfaden rules
    // check for n° of nebenfächer
    if(nebenfacher.length < 5) {
      $("#pre_log").append('<div class="problem">[!] BlockI: Nicht gen&uuml;gend Nebenf&auml;cher (min. 5)</div>');
    }
    
    // check for mandatory stuff
    // -> geschichte
    if(kernfacher[4].name != 'ge') { // if kernfach2 != geschichte
      var o_isFachIn = isFachIn(nebenfacher, 'ge');
      if(o_isFachIn.result == false) {
        $("#pre_log").append('<div class="problem">[!] BlockI: Kein Geschichte gew&auml;hlt</div>');
      } else if(countTrue(nebenfacher[o_isFachIn.i].include) < 4) { // 4x the course
        $("#pre_log").append('<div class="problem">[!] BlockI: <4 Kurse Geschichte gew&auml;hlt</div>');
      }
    }
    
    // -> EK/GK
    // we have multiple cases, but in every case EK/GK must be in the NF list
    var o_isFachIn = isFachIn(nebenfacher, 'ek');
    if(o_isFachIn.result == false){
      $("#pre_log").append('<div class="problem">[!] BlockI: Kein EK/GK gew&auml;hlt</div>');
    } else {
      if(kernfacher[4].name == 'ek'){ // we have EK as KF, so gray out 1. and 4. HJ of EK/GK
        $('#kres_n'+(o_isFachIn.i+1)+'-1_include').removeAttr('checked');
        $('#kres_n'+(o_isFachIn.i+1)+'-1_include').attr('disabled', true);
        $('#kres_n'+(o_isFachIn.i+1)+'-1').attr('disabled', true);
        
        $('#kres_n'+(o_isFachIn.i+1)+'-2_include').attr('checked', 'checked');
        $('#kres_n'+(o_isFachIn.i+1)+'-2_include').attr('disabled', true);
        $('#kres_n'+(o_isFachIn.i+1)+'-3_include').attr('checked', 'checked');
        $('#kres_n'+(o_isFachIn.i+1)+'-3_include').attr('disabled', true);
        
        $('#kres_n'+(o_isFachIn.i+1)+'-4_include').removeAttr('checked');
        $('#kres_n'+(o_isFachIn.i+1)+'-4_include').attr('disabled', true);
        $('#kres_n'+(o_isFachIn.i+1)+'-4').attr('disabled', true);
      } else if(kernfacher[4].name == 'gk') {
        $('#kres_n'+(o_isFachIn.i+1)+'-1_include').attr('checked', 'checked');
        $('#kres_n'+(o_isFachIn.i+1)+'-1_include').attr('disabled', true);
        
        $('#kres_n'+(o_isFachIn.i+1)+'-2_include').removeAttr('checked');
        $('#kres_n'+(o_isFachIn.i+1)+'-2_include').attr('disabled', true);
        $('#kres_n'+(o_isFachIn.i+1)+'-2').attr('disabled', true);
        
        $('#kres_n'+(o_isFachIn.i+1)+'-3_include').removeAttr('checked');
        $('#kres_n'+(o_isFachIn.i+1)+'-3_include').attr('disabled', true);
        $('#kres_n'+(o_isFachIn.i+1)+'-3').attr('disabled', true);
        
        $('#kres_n'+(o_isFachIn.i+1)+'-4_include').attr('checked', 'checked');
        $('#kres_n'+(o_isFachIn.i+1)+'-4_include').attr('disabled', true);
      }
    }
    
    // -> BK/Mu
    var o_isFachIn = isFachIn(nebenfacher, 'bk');
    if(o_isFachIn.result == false){
      $("#pre_log").append('<div class="problem">[!] BlockI: Kein BK/Mu gew&auml;hlt</div>');
    } else {
      // BK|MU = KF
      if((kernfacher[4].name != 'bk') && (kernfacher[4].name != 'mu')) {
        if(countTrue(nebenfacher[o_isFachIn.i].include) < 2) { // 2x the course
        $("#pre_log").append('<div class="problem">[!] BlockI: <2 Kurse BK/Mu gew&auml;hlt</div>');
      }
      }
    }
    
    // -> Bio/Ch/Ph
    var o_isFachIn = isFachIn(nebenfacher, 'bk');
    if(o_isFachIn.result == false){
      $("#pre_log").append('<div class="problem">[!] BlockI: Kein BK/Mu gew&auml;hlt</div>');
    } else {
      // BK|MU = KF
      if((kernfacher[4].name != 'bk') && (kernfacher[4].name != 'mu')) {
        if(countTrue(nebenfacher[o_isFachIn.i].include) < 2) { // 2x the course
        $("#pre_log").append('<div class="problem">[!] BlockI: <2 Kurse BK/Mu gew&auml;hlt</div>');
      }
      }
    }
    
    // -> SK
    var o_isFachIn = isFachIn(nebenfacher, 'sk');
    if(o_isFachIn.result != false){
      $("#pre_log").append('<div class="normal">[i] SK vorhanden, entweder als Kurs oder mdl. Pr&uuml;fung</div>');
    
      $('#kres_n'+(o_isFachIn.i+1)+'-3_include').removeAttr('checked');
      $('#kres_n'+(o_isFachIn.i+1)+'-3_include').attr('disabled', true);
      $('#kres_n'+(o_isFachIn.i+1)+'-3').attr('disabled', true);
        
      $('#kres_n'+(o_isFachIn.i+1)+'-2_include').attr('checked', 'checked');
      $('#kres_n'+(o_isFachIn.i+1)+'-2_include').attr('disabled', true);
      $('#kres_n'+(o_isFachIn.i+1)+'-2').attr('disabled', true);
      var v = $('#kres_n'+(o_isFachIn.i+1)+'-1 option:selected').val();
      $('#kres_n'+(o_isFachIn.i+1)+'-2 option[value="'+v+'"]').attr('selected', true);
      $('#kres_n'+(o_isFachIn.i+1)+'-2_include').removeAttr('checked');
      $('#kres_n'+(o_isFachIn.i+1)+'-2_include').attr('checked', $('#kres_n'+(o_isFachIn.i+1)+'-1_include').attr('checked'));
      
      $('#kres_n'+(o_isFachIn.i+1)+'-4_include').removeAttr('checked');
      $('#kres_n'+(o_isFachIn.i+1)+'-4_include').attr('disabled', true);
      $('#kres_n'+(o_isFachIn.i+1)+'-4').attr('disabled', true);
    }
    
    // check if number of nebenfachkurse > or < 20
    var n_nebenkurse = 0;
    for(var i = 0; i < nebenfacher.length; i++)
    {
      n_nebenkurse += countTrue(nebenfacher[i].include);
    }
    if(n_nebenkurse < 20) {
      $("#pre_log").append('<div class="problem">[!] BlockI: <20 Nebenkurse gew&auml;hlt</div>');
    } else if(n_nebenkurse > 20) {
      $("#pre_log").append('<div class="normal">[i] BlockI: >20 Nebenkurse gew&auml;hlt, Punkte werden runtergerechnet</div>');
    }
    
    
    // set the sums
    var hj1_sum = parseInt(kernfacher[0].res[0]) +
                parseInt(kernfacher[1].res[0]) +
                parseInt(kernfacher[2].res[0]) +
                parseInt(kernfacher[3].res[0]) +
                parseInt(kernfacher[4].res[0]);
    for(var i = 0; i < nebenfacher.length; i++)
    {
      if(nebenfacher[i].include[0])
      {
        hj1_sum += parseInt(nebenfacher[i].res[0]);
      }
    }
    $("#kres_hj1").text(hj1_sum);
    
    var hj2_sum = parseInt(kernfacher[0].res[1]) +
                parseInt(kernfacher[1].res[1]) +
                parseInt(kernfacher[2].res[1]) +
                parseInt(kernfacher[3].res[1]) +
                parseInt(kernfacher[4].res[1]);
    for(var i = 0; i < nebenfacher.length; i++)
    {
      if(nebenfacher[i].include[1])
      {
        hj2_sum += parseInt(nebenfacher[i].res[1]);
      }
    }
    $("#kres_hj2").text(hj2_sum);
    
    var hj3_sum = parseInt(kernfacher[0].res[2]) +
                parseInt(kernfacher[1].res[2]) +
                parseInt(kernfacher[2].res[2]) +
                parseInt(kernfacher[3].res[2]) +
                parseInt(kernfacher[4].res[2]);
    for(var i = 0; i < nebenfacher.length; i++)
    {
      if(nebenfacher[i].include[2])
      {
        hj3_sum += parseInt(nebenfacher[i].res[2]);
      }
    }
    $("#kres_hj3").text(hj3_sum);
    
    var hj4_sum = parseInt(kernfacher[0].res[3]) +
                parseInt(kernfacher[1].res[3]) +
                parseInt(kernfacher[2].res[3]) +
                parseInt(kernfacher[3].res[3]) +
                parseInt(kernfacher[4].res[3]);
    for(var i = 0; i < nebenfacher.length; i++)
    {
      if(nebenfacher[i].include[3])
      {
        hj4_sum += parseInt(nebenfacher[i].res[3]);
      }
    }
    $("#kres_hj4").text(hj4_sum);
    
}

BlockI.prototype.getTotal = function() {
  var ret = 0;
  ret += parseInt($("#kres_hj1").text());
  ret += parseInt($("#kres_hj2").text());
  ret += parseInt($("#kres_hj3").text());
  ret += parseInt($("#kres_hj4").text());
  
  return ret;
}

function BlockII(root) {
    this.root = root;
}

BlockII.prototype.check = function() {
    // we have the following to check
    // 1. Deutsch
    // 2. Mathe
    // 3. [Frmdspr]
    // 4. [Kernfach-S]
    // 5. [Mdl]
    
    var deutschInput = $(this.root).find('#abires_deutsch option:selected').text();
    var matheInput = $(this.root).find('#abires_mathe option:selected').text();
    //log('[BlkII check] -> De: '+deutschInput+'; Ma: '+matheInput);
}

BlockII.prototype.getTotal = function() {
  var ret = 0;
  ret += parseInt($("#abires_deutsch option:selected").text())*4;
  ret += parseInt($("#abires_mathe option:selected").text())*4;
  ret += parseInt($("#abires_fs option:selected").text())*4;
  ret += parseInt($("#abires_kernfach option:selected").text())*4;
  ret += parseInt($("#abires_mdl option:selected").text())*4;
  
  return ret;
}
