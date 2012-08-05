// logic.js -- Abirechner '13 Logic JS
// (C) 2012 Sebastian Sitaru <s.sitaru@gmx.de>
// licensed under the GNU GPL v3 (see LICENSE)

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
}

BlockI.prototype.calc = function() {
	this.kernfacher = [];
    this.nebenfacher = [];

  	// clear the log
	$("#pre_log").html('');
	// re-enable all previously disabled control elements
	$('._recalc_on_change').removeAttr('disabled');
	$('select').removeAttr('disabled');
	this.read();
    this.check();
	this.setSums();
}

BlockI.prototype.read = function() {
	var res_de = getPktForHJ('kres_de');
    var res_ma = getPktForHJ('kres_ma');
    var res_fs = getPktForHJ('kres_fs');
    var res_k1 = getPktForHJ('kres_k1-');
    var res_k2 = getPktForHJ('kres_k2-');

    // read points
    this.kernfacher[0] = {
        name: 'de',
        res: res_de
    };
    this.kernfacher[1] = {
        name: 'ma',
        res: res_ma
    };
    this.kernfacher[2] = {
        name: $("#kfach_fs option:selected").val(),
        res: res_fs
    };
    this.kernfacher[3] = {
        name: $("#kfach_k1 option:selected").val(),
        res: res_k1
    };
    this.kernfacher[4] = {
        name: $("#kfach_k2 option:selected").val(),
        res: res_k2
    };
	var cl_nebenfacher = this.nebenfacher;
    $("._nebenfach").each(function(){
        var id = ''+$(this).find('select.sel_punkte:first-child').attr('id');
        if($(this).find('select.sel_neben option:selected').val() != "<leer>"){ // if this is not a <leer> entry
          cl_nebenfacher[cl_nebenfacher.length] = {
              name: $(this).find('select.sel_neben option:selected').val(),
              res: getPktForHJ(id.slice(0, -1)),
              include: getCheckboxesForHJ(id.slice(0, -1))
          };
        }
    });
}

BlockI.prototype.check = function() {
    // check the stuff based on the Abi13 Leitfaden rules
    // check for n° of nebenfächer
    if(this.nebenfacher.length < 5) {
      $("#pre_log").append('<div class="problem">[!] BlockI: Nicht gen&uuml;gend Nebenf&auml;cher (min. 5)</div>');
    }
    
    // check for mandatory stuff
    // -> geschichte
    if(this.kernfacher[4].name != 'ge') { // if kernfach2 != geschichte
      var o_isFachIn = isFachIn(this.nebenfacher, 'ge');
      if(o_isFachIn.result == false) {
        $("#pre_log").append('<div class="problem">[!] BlockI: Kein Geschichte gew&auml;hlt</div>');
      } else if(countTrue(this.nebenfacher[o_isFachIn.i].include) < 4) { // 4x the course
        $("#pre_log").append('<div class="problem">[!] BlockI: <4 Kurse Geschichte gew&auml;hlt</div>');
      }
    }
    
    // -> EK/GK
    // we have multiple cases, but in every case EK/GK must be in the NF list
    var o_isFachIn = isFachIn(this.nebenfacher, 'ek');
    if(o_isFachIn.result == false){
      $("#pre_log").append('<div class="problem">[!] BlockI: Kein EK/GK gew&auml;hlt</div>');
    } else {
      if(this.kernfacher[4].name == 'gk'){ // we have EK as KF, so gray out 2. and 3. HJ of EK/GK
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
      } else if(this.kernfacher[4].name == 'ek') {
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
    var o_isFachIn = isFachIn(this.nebenfacher, 'bk');
    if(o_isFachIn.result == false){
      $("#pre_log").append('<div class="problem">[!] BlockI: Kein BK/Mu gew&auml;hlt</div>');
    } else {
      // BK|MU = KF
      if((this.kernfacher[4].name != 'bk') && (this.kernfacher[4].name != 'mu')) {
        if(countTrue(this.nebenfacher[o_isFachIn.i].include) < 2) { // 2x the course
        $("#pre_log").append('<div class="problem">[!] BlockI: <2 Kurse BK/Mu gew&auml;hlt</div>');
      }
      }
    }
    
    // -> Bio/Ch/Ph COMPLICATED
	if((this.kernfacher[3].name == 'bio')  || (this.kernfacher[3].name == 'ch') || (this.kernfacher[3].name == 'ph'))
	{
		//$('#pre_log').append('<div class="normal">[i] 1. Kernfach ist NW</div>');
		if(!((this.kernfacher[4].name == 'bio')  || (this.kernfacher[4].name == 'ch') || (this.kernfacher[4].name == 'ph'))) {
			// we need only 4 more courses of NW in the nebenfacher
			//$('#pre_log').append('<div class="normal">[i] 2. Kernfach ist NICHT NW</div>');
			// count the included ph, ch, bio nebenfacher and decide
			var o_bioAsNF = isFachIn(this.nebenfacher, 'bio');
			var o_chAsNF = isFachIn(this.nebenfacher, 'ch');
			var o_phAsNF = isFachIn(this.nebenfacher, 'ph');
			var b_allOK = false;
			// if we have bio & the bio count is == 4 -> OKAY
			if(o_bioAsNF.result && (countTrue(this.nebenfacher[o_bioAsNF.i].include) == 4))
			{
				b_allOK = true;
			} else if(o_chAsNF.result && (countTrue(this.nebenfacher[o_chAsNF.i].include) == 4))
			{
				b_allOK = true;
			} else if(o_chAsNF.result && (countTrue(this.nebenfacher[o_chAsNF.i].include) == 4))
			{
				b_allOK = true;
			}
			if(!b_allOK)
			{
				$('#pre_log').append('<div class="problem">[!] BlockI: Alle 8 naturwissenschaftlichen Kurse m&uuml;ssen ausgew&auml;hlt werden</div>');
			}
		} else {
			//$('#pre_log').append('<div class="normal">[i] 2. Kernfach ist NW</div>');
		}
		
	} else { // keine NW als Kern
		//$('#pre_log').append('<div class="normal">[i] Keine NW als Kernfach</div>');
		var o_bioAsNF = isFachIn(this.nebenfacher, 'bio');
		var o_chAsNF = isFachIn(this.nebenfacher, 'ch');
		var o_phAsNF = isFachIn(this.nebenfacher, 'ph');
		if (o_bioAsNF.result) o_bioAsNF.count = countTrue(this.nebenfacher[o_bioAsNF.i].include);
		if (o_chAsNF.result) o_chAsNF.count = countTrue(this.nebenfacher[o_chAsNF.i].include);
		if (o_phAsNF.result) o_phAsNF.count = countTrue(this.nebenfacher[o_phAsNF.i].include);
		var b_allOK = false;
		var f_isOK = function(o){
			if(o.result && (o.count == 4)) return true;
			return false;
		}
		// bruteforce that shit
		if(f_isOK(o_bioAsNF) && f_isOK(o_chAsNF)) b_allOK = true;
		if(f_isOK(o_bioAsNF) && f_isOK(o_phAsNF)) b_allOK = true;
		if(f_isOK(o_chAsNF) && f_isOK(o_phAsNF)) b_allOK = true;
		if(!b_allOK) {
			$('#pre_log').append('<div class="problem">[!] BlockI: 2x4 naturwiss. Kurse m&uuml;ssen gew&auml;hlt werden</div>');
		}
	}
    
    
    // -> SK
    var o_isFachIn = isFachIn(this.nebenfacher, 'sk');
    if(o_isFachIn.result != false){
      $("#pre_log").append('<div class="normal">[i] BlockI: SK vorhanden, entweder als Kurs oder mdl. Pr&uuml;fung</div>');
    
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
    for(var i = 0; i < this.nebenfacher.length; i++)
    {
      n_nebenkurse += countTrue(this.nebenfacher[i].include);
    }
    if(n_nebenkurse < 20) {
    	$("#pre_log").append('<div class="problem">[!] BlockI: <20 Nebenkurse gew&auml;hlt</div>');
    } else if(n_nebenkurse > 20) {
    	$("#pre_log").append('<div class="normal">[i] BlockI: >20 Nebenkurse gew&auml;hlt, <br/>Punkte werden runtergerechnet</div>');
	  	$('#_nebenfacher_mehrals20').text('true');
    }
	$('#_nebenfacher_count').text(n_nebenkurse);
    
}

BlockI.prototype.setSums = function() {
	// set the sums
    var hj1_sum = parseInt(this.kernfacher[0].res[0]) +
                parseInt(this.kernfacher[1].res[0]) +
                parseInt(this.kernfacher[2].res[0]) +
                parseInt(this.kernfacher[3].res[0]) +
                parseInt(this.kernfacher[4].res[0]);
    for(var i = 0; i < this.nebenfacher.length; i++)
    {
      if(this.nebenfacher[i].include[0])
      {
        hj1_sum += parseInt(this.nebenfacher[i].res[0]);
      }
    }
    $("#kres_hj1").text(hj1_sum);
    
    var hj2_sum = parseInt(this.kernfacher[0].res[1]) +
                parseInt(this.kernfacher[1].res[1]) +
                parseInt(this.kernfacher[2].res[1]) +
                parseInt(this.kernfacher[3].res[1]) +
                parseInt(this.kernfacher[4].res[1]);
    for(var i = 0; i < this.nebenfacher.length; i++)
    {
      if(this.nebenfacher[i].include[1])
      {
        hj2_sum += parseInt(this.nebenfacher[i].res[1]);
      }
    }
    $("#kres_hj2").text(hj2_sum);
    
    var hj3_sum = parseInt(this.kernfacher[0].res[2]) +
                parseInt(this.kernfacher[1].res[2]) +
                parseInt(this.kernfacher[2].res[2]) +
                parseInt(this.kernfacher[3].res[2]) +
                parseInt(this.kernfacher[4].res[2]);
    for(var i = 0; i < this.nebenfacher.length; i++)
    {
      if(this.nebenfacher[i].include[2])
      {
        hj3_sum += parseInt(this.nebenfacher[i].res[2]);
      }
    }
    $("#kres_hj3").text(hj3_sum);
    
    var hj4_sum = parseInt(this.kernfacher[0].res[3]) +
                parseInt(this.kernfacher[1].res[3]) +
                parseInt(this.kernfacher[2].res[3]) +
                parseInt(this.kernfacher[3].res[3]) +
                parseInt(this.kernfacher[4].res[3]);
    for(var i = 0; i < this.nebenfacher.length; i++)
    {
      if(this.nebenfacher[i].include[3])
      {
        hj4_sum += parseInt(this.nebenfacher[i].res[3]);
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

BlockII.prototype.calc = function() {
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
