//------------------------------------
$vm.module_list={
    "Home":             {"table_id":"",         "url":"modules/home.html"},
    "Workbench":        {"table_id":"",         "url":"https://codepen.io/vmiis/pen/VxoPYx.html"},
    "system-structure": {"table_id":"",         "url":"https://www.vmiis.com/pages/help/structure.html"},
    "screening-data":   {"table_id":"20011503", "url":"https://codepen.io/vmiis/pen/zjgROg.html", form_module:'screening-form'},
    "screening-form":   {"table_id":"20011503", "url":"https://codepen.io/vmiis/pen/zjgNRp.html"}
}
//------------------------------------
$vm.app_config={
    "api_path_development":"https://cbs.wappsystem.com/dev/",
    "api_path_production":"https://cbs.wappsystem.com/dev/",
    "default_production":"No",
    "panels":{
          "pages":	    {"url":"","modules":[]}
    }
}
//------------------------------------
$vm.website_module_list_for_search=[];
//------------------------------------
function vm_init(callback){
    console.log((new Date().getTime()-$vm.start_time).toString()+"---"+"********************* start running init ************************");
    //--------------------------------------------------------
    //check and clear localstorage
    var data=''; for(var key in window.localStorage){ if(window.localStorage.hasOwnProperty(key)){ data+=window.localStorage[key]; }}
    if(data.length>3000000) localStorage.clear();
    if(window.location.href.indexOf('?clearcache=1')!=-1){
        localStorage.clear();
        alert("Cache is cleard!");
        return;
    }
    $VmAPI={};
    //--------------------------------------------------------
    //get hosting path
    var href = window.location.href.split('?')[0];
    var path=href.split('/index.html')[0];
    var lastChar=path[path.length-1];
    if(lastChar=='/') path=path.substring(0,path.length-1);
    $vm.hosting_path=path;
    //if(window.location.hostname=='127.0.0.1' || window.location.hostname=='localhost')	$vm.debug =true;
    //--------------------------------------------------------
    $vm.reload='';
    if(window.location.toString().indexOf('_d=3')!=-1){
        $vm.reload=new Date().getTime().toString();
    }
    $vm.version=$vm.ver[0];
    //--------------------------------------------------------
    $vm.parts_path="https://vmiis.github.io/component";
    if(window.location.hostname=='127.0.0.1' || window.location.hostname=='localhost'){
        $vm.library_path =window.location.protocol+'//'+window.location.host;
    }
    //--------------------------------------------------------
    if($vm.app_config.default_production=='No'){
        if(window.location.toString().indexOf('database=production')!=-1){
            $vm.server          ='production';
            $VmAPI.api_base     =$vm.app_config.api_path_production;
        }
        else if(window.location.toString().indexOf('database=woolcock')!=-1){
            $vm.server          ='production';
            $VmAPI.api_base     =$vm.app_config.api_path_woolcock;
        }
        else{
            $vm.server          ='development';
            $VmAPI.api_base     =$vm.app_config.api_path_development;
        }
    }
    else {
        if(window.location.toString().indexOf('database=development')!=-1){
            $vm.server          ='development';
            $VmAPI.api_base     =$vm.app_config.api_path_development;
        }
        else{
            $vm.server          ='production';
            $VmAPI.api_base     =$vm.app_config.api_path_production;
        }
    }
    $vm.debug_message=true; //show debug message in console
    //--------------------------------------------------------
    //load vm framework, vm api and first module
    var load_vmapi   =function(){ load_js($vm.url('https://vmiis.github.io/api/distribution/vmapi.min.js'),load_vm);	}
    var load_vm      =function(){ load_js($vm.url('https://vmiis.github.io/framework/distribution/vmframework.min.js'),init);}
    var init         =function(){
         $vm.init_v3({callback:function(){
            $vm.init_status=1;
            $vm._id=0;
            callback();
        }})
    }
    //--------------------------------------------------------
    var load_js=function(url,next){
        //this is js loader
        var ver=localStorage.getItem(url+"_ver");
        var txt=localStorage.getItem(url+"_txt");
        //------------------------------------------
        if(ver!=$vm.ver[1] || txt===null){
            console.log((new Date().getTime()-$vm.start_time).toString()+"---"+'loading '+url+'?_='+$vm.ver[1]);
            $.get(url+'?_='+$vm.reload,function(data){
                localStorage.setItem(url+"_txt",data);
                localStorage.setItem(url+"_ver",$vm.ver[1]);
                $('head').append('<scr'+'ipt>'+data+'</scr'+'ipt>');
                next();
            },'text');
        }
        else{ $('head').append('<scr'+'ipt>'+txt+'</scr'+'ipt>'); next(); }
        //------------------------------------------
    }
    //--------------------------------------------------------
    $vm.url=function(text){
		//replace some text in old modules to the correct ones
		text=text.replace(/__HOST__\//g,$vm.hosting_path+'/');
		text=text.replace(/__VER__/g,$vm.ver[0]);
		text=text.replace(/__BASE__\/vmiis\/Common-Code\//g,'__COMPONENT__/');
		text=text.replace(/__LIB__\/vmiis\/Common-Code\//g,'__COMPONENT__/');
		text=text.replace(/__BASE__\/vmiis\/common-code\//g,'__COMPONENT__/');
		text=text.replace(/__LIB__\/vmiis\/common-code\//g,'__COMPONENT__/');
		text=text.replace(/__PARTS__\//g,'https://vmiis.github.io/component/');
		text=text.replace(/__COMPONENT__\//g,'https://vmiis.github.io/component/');
		text=text.replace(/https:\/\/vmiis.github.io\/modular-distributed-web-application\//g,'https://www.vmiis.com/');
		if(window.location.hostname=='127.0.0.1' || window.location.hostname=='localhost'){
			//use local version
			text=text.replace(/https:\/\/cbs.wappsystem.com\/dev\/github/g,window.location.protocol+'//'+window.location.host);
			text=text.replace(/https:\/\/cbs.wappsystem.com\/pro\/github/g,window.location.protocol+'//'+window.location.host);
			//text=text.replace(/https:\/\/distributed-modules.vmiis.com/g,window.location.protocol+'//'+window.location.host+'/vmiis/distributed-modules');

			//do not use local system files
			text=text.replace(/http:\/\/127.0.0.1:8000\/vmiis\/api/g,'https://vmiis.github.io/api');
			text=text.replace(/http:\/\/127.0.0.1:8000\/vmiis\/framework/g,'https://vmiis.github.io/framework');
			text=text.replace(/http:\/\/127.0.0.1:8000\/vmiis\/component/g,'https://vmiis.github.io/component');
			text=text.replace(/http:\/\/127.0.0.1:8000\/vmiis\/modules/g,'https://vmiis.github.io/modules');

			text=text.replace(/https:\/\/woolcock-imr.github.io/g,					window.location.protocol+'//'+window.location.host+'/woolcock-imr');
			text=text.replace(/https:\/\/volunteer-database.rt.org.au/g,			window.location.protocol+'//'+window.location.host+'/woolcock-imr/volunteer-database-2');
			text=text.replace(/https:\/\/volunteer-database-management.rt.org.au/g,	window.location.protocol+'//'+window.location.host+'/woolcock-imr/volunteer-database-management-2');
			text=text.replace(/https:\/\/wappsystem.github.io/g,					window.location.protocol+'//'+window.location.host+'/wappsystem');

		}
		if(window.location.toString().indexOf('_d=1')!=-1){
			//use local system files
			var host=window.location.protocol+'//'+window.location.host;
			text=text.replace(/https:\/\/vmiis.github.io\/api/g,host+'/vmiis/api');
			text=text.replace(/https:\/\/vmiis.github.io\/framework/g,host+'/vmiis/framework');
			text=text.replace(/https:\/\/vmiis.github.io\/component/g,host+'/vmiis/component');
			text=text.replace(/https:\/\/vmiis.github.io\//g,host+'/vmiis/applications/');
		}
		if(window.location.toString().indexOf('_d=2')!=-1){
			//use latest unstable version (master branch, not gh-pages branch)
			text=text.replace(/https:\/\/vmiis.github.io\/api/g,'https://raw.githubusercontent.com/vmiis/api/master');
			text=text.replace(/https:\/\/vmiis.github.io\/framework/g,'https://raw.githubusercontent.com/vmiis/framework/master');
			text=text.replace(/https:\/\/vmiis.github.io\/component/g,'https://raw.githubusercontent.com/vmiis/component/master');
			text=text.replace(/https:\/\/vmiis.github.io\/modules/g,'https://raw.githubusercontent.com/vmiis/modules/master');
			text=text.replace(/http:\/\/127.0.0.1:8000\/vmiis\/api/g,'https://raw.githubusercontent.com/vmiis/api/master');
			text=text.replace(/http:\/\/127.0.0.1:8000\/vmiis\/framework/g,'https://raw.githubusercontent.com/vmiis/framework/master');
			text=text.replace(/http:\/\/127.0.0.1:8000\/vmiis\/component/g,'https://raw.githubusercontent.com/vmiis/component/master');
			text=text.replace(/http:\/\/127.0.0.1:8000\/vmiis\/modules/g,'https://raw.githubusercontent.com/vmiis/modules/master');
		}
		return text;
	}
	//------------------------------------
    load_vmapi();
    //------------------------------------
}
//------------------------------------
vm_init(function(){
    var resources=[
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
      "https://ajax.aspnetcdn.com/ajax/jquery.ui/1.12.1/themes/redmond/jquery-ui.css",

      "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js",
      "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js",
      "https://ajax.aspnetcdn.com/ajax/jquery.ui/1.12.1/jquery-ui.min.js",
      "https://apis.google.com/js/plusone.js",
      "https://ajax.aspnetcdn.com/ajax/jquery.validate/1.14.0/jquery.validate.min.js",
      "https://sdk.amazonaws.com/js/aws-sdk-2.1.34.min.js",
      "https://www.gstatic.com/charts/loader.js"
    ];
    //------------------------------------
    var load_resources=function(links){
      for(i in links){
        var e=links[i].split('.').pop();
        if(e=='css'){
          $('head').append("<link rel='stylesheet' href='"+links[i]+"'>");
        }
        else if(e=='js'){
          load_js_link(links[i])
        }
      }
      var load_system_modules=function(){
          //-------------------------------------
          $vm.module_list['_system_export_dialog_module']={table_id:'',url:'__COMPONENT__/dialog/export_dialog_module.html',"name_for_search":""};
          $vm.load_module_v2('_system_export_dialog_module','hidden',{})
          //-------------------------------------
          $vm.module_list['_system_import_dialog_module']={table_id:'',url:'__COMPONENT__/dialog/import_dialog_module.html',"name_for_search":""};
          $vm.load_module_v2('_system_import_dialog_module','hidden',{})
          //-------------------------------------
          $vm.module_list['uploading_file_dialog_module']={table_id:'',url:'__COMPONENT__/dialog/uploading_file_dialog_module.html',"name_for_search":""};
          $vm.load_module_v2('uploading_file_dialog_module','hidden',{})
          //-------------------------------------
      }
      var load_hot_modules=function(){
          //pre load into memory, for fast showing on screen
          //-------------------------------------
          //$vm.nav_load_module('page-examples_snapshot-about','hidden',{})
          //-------------------------------------
      }
      //------------------------------------
      load_system_modules();
      load_hot_modules();
    }
    //------------------------------------
    var load_js_link=function(link){
      $.getScript(link,function(){
        var nm=link.split('/').pop();
        nm=nm.replace(/\./g,'-');
        $vm[nm]=1;
        if(nm=='loader-js'){
          google.charts.load('current', {packages: ['corechart']});
        }
      });
    }
    //------------------------------------
    var over_write_alert=function(){
      $vm.alert=function(msg){
        $('#vm_alert_information div.modal-body').html( $('<div/>').html(msg).text() );
        $("#vm_alert_information").modal();
      }
      $vm.close_alert=function(){
        $('#vm_alert_information').modal('hide');
      }
    }
    //------------------------------------
    var load_search_modules=function(){
        var a=window.location.href.split('module=');
        if(a.length==2){
            var name=a[1].split('&')[0];
            if(name.length>0){
                if($vm.module_list[name]!=undefined){
                    $vm.nav_load_module(name);
                    return;
                }
                else alert("The module "+name+" is not in the module list!");
            }
            else alert("The module "+name+" is not correct!");
        }
    }
    //------------------------------------
    var set_module_search=function(){
        var search_loop=setInterval(function (){
			if($vm['jquery-ui-min-js']==1){
				clearInterval(search_loop);
                for(k in $vm.module_list){
                    if($vm.module_list[k].name_for_search!=undefined){
                        if($vm.module_list[k].name_for_search!=""){
                            $vm.website_module_list_for_search.push($vm.module_list[k].name_for_search);
                        }
                    }
                    else $vm.website_module_list_for_search.push(k);
                }
                $("#vm_system_search").autocomplete({
                    minLength:0,
                    source: function(request, response) {
                        var results=$.ui.autocomplete.filter($vm.website_module_list_for_search, request.term);
                        response(results.slice(0, 10));
                    },
                    select: function(event,ui) {
                        event.preventDefault();
                        $('.navbar-collapse').collapse('hide');
                        $("#vm_system_search").val('');
                        $("#vm_system_search").blur();
                        $('.ui-helper-hidden-accessible').html('');
                        $vm.load_module_v2(ui.item.value,'',{});
                    }
                });
                $("#vm_system_search").focus(function(){$("#vm_system_search").autocomplete("search","");});
				console.log((new Date().getTime()-$vm.start_time).toString()+"---"+"********************* search is ready ************************");
			}
		},100);
		//------------------------------------
    }
    //------------------------------------
    var loading_back_image=function(){
        //This is the place we can add background image to body (Asynchronous)
        var $image1 = $("<img>");
        $image1.on('load',(function(){
            $('body').css("background", "url("+$(this).attr("src")+") no-repeat bottom center"); $('body').css("background-size", "cover");
            console.log((new Date().getTime()-$vm.start_time).toString()+"---"+"********************* background image is ready ************************");
        }));
        $image1.attr("src", "index.jpg");
    }
    //------------------------------------
    vm_layout();
    vm_top_right_corner();
    vm_header();
    vm_footer();
    $vm.load_module_v2("Home",'',{});
    setTimeout(function (){	$.ajaxSetup({cache:true}); load_resources(resources); },10);
    loading_back_image();
    over_write_alert();
    set_module_search();
})
//------------------------------------
