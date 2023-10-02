
function printFields(db){
    const returnArr = [];
    var opt = "";
    var fieldsList = "";
    var relatedList = "";
    var i = 0;
    db.forEach(obj => {
        const tableName = Object.keys(obj)[0];
        const relatedFeild = Object.keys(obj)[2];
        const relatedTableTo = Object.keys(obj)[3];
        const relatedFeildTo = Object.keys(obj)[4];
        if(i > 0){
            relatedList += `LEFT JOIN ${obj["table_name"]} ON ${obj["table_name"]}.${obj["related_field"]} = ${obj["related_table_to"]}.${obj["related_field_to"]} `;
        }else{
            relatedList += `FROM ${obj["table_name"]} `;
            i++;
        }
        obj.condition_fields.forEach(condition_fields => {
          console.log(`${obj["table_name"]}.${condition_fields},${obj["related_field_to"]}`);
          opt += `<option value="${obj["table_name"]}.${condition_fields}">${condition_fields}</option>`;
          fieldsList += `${obj["table_name"]}.${condition_fields},`;
        });
      });
      return [opt, fieldsList.slice(0, -1),relatedList]
      
}
var fieldsConfig = printFields(db);



class QueryBuilder {
    constructor(fieldsConfig) {
      this.relatedList = fieldsConfig[2]
      this.Fields = fieldsConfig[1]
        
    }
    AudienceMasterQuery(c) {
        let q = 
            `SELECT  
                ${this.Fields}
                ${this.relatedList}
                `;
                
                if(c != ""){
                    q += `
                        WHERE
                            ${c}
                    `;
                }
                
        return q;
    }


    
}




function newSubCondition(MainConditionNumber,SubConditionNumber,SubConditionType,MainConditionId,SubConditionId){
    if(SubConditionType != 0){
        newConditionBoxIn =`
            <div class="container" id="Bitwise${SubConditionId}">
                <button class="button-6 newSubConditionButton" data-remove="${SubConditionId}"  data-mainid="${MainConditionId}" data-mainnumber="${MainConditionNumber}" data-subid="${SubConditionId}" data-subnumber="${SubConditionNumber}" style="margin-left:auto; right margin-top: auto;" id="infoCondition${SubConditionNumber}">${SubConditionType}</button>
            </div>`;
    }else{
        newConditionBoxIn = ``;
    }
                newConditionBoxIn +=`
                        <div class="ConditiosDataIn" style="display: none;" id="infoCondition${SubConditionId}" data-subconditiontype="${SubConditionType}" data-mainid="${MainConditionId}" data-mainnumber="${MainConditionNumber}" data-subid="${SubConditionId}" data-subnumber="${SubConditionNumber}" data-subconditiontype="${SubConditionType}" data-type="" data-operator="LIKE" data-value="" data-table="OrderItem" ></div>

                            <div class="select button-39" id="${SubConditionId}">
                                by
                                <select class="type" id="type_${SubConditionId}">
                                    <option value="0">fields</option>
                                    ${fieldsConfig[0]}
                                   
                                
                                </select> 
                                <select class="operators" id="operator_${SubConditionId}" >
                                    <option value="LIKE">Contain</option>
                                    <option value=">">great then</option>
                                    <option value="<">less then</option>
                                    <option value="=">equal</option>
                                    <option value="<>"> not equal</option>
                                </select>
                                <input placeholder="value.." id="value_${SubConditionId}" name="first_cat_formula__c"/>`;
                                
                    if(SubConditionType != 0) newConditionBoxIn +=`<button class="cleanButton removeIn" style="float: right;" data-remove="${SubConditionId}"><img style="width: 35px;" src="assets/cancel.svg" /></button>`;
                    newConditionBoxIn +=`</div>`;
                    return newConditionBoxIn;
}

$(document).ready(function () {
    var product = false, order = false;
  
    const mainarrsubnumber = [];
    var MainConditionNumber = 0;

    $('.newMainConditionButton').click(function(){
        MainConditionNumber++; 
        if(MainConditionNumber > 0){
            $('#newAll').hide();
            $('.conditionButton').show();
        }else{
            $('#newAll').show();
            $('.conditionButton').hide();
        }
        mainarrsubnumber[MainConditionNumber] = 1;
        SubConditionNumber = mainarrsubnumber[MainConditionNumber];



        MainConditionId = 'c' + MainConditionNumber;
        SubConditionId = 'c' + MainConditionNumber + '-' + SubConditionNumber;
        console.log("MainConditionId" + MainConditionId);
        console.log("SubConditionId" + SubConditionId);

        // if(MainConditionNumber > 0){
        //     $('.orC').show();
        // }
        var div = document.createElement("div");
       div.className = MainConditionId;
        //div.id = MainConditionId;
        var MainConditionType = this.getAttribute("data-conditiontype");
        var newConditionBox = ``;
                    conditiontype = 0;
                    SubConditionType = 0;

                    newConditionBoxIn = newSubCondition(MainConditionNumber,SubConditionNumber,SubConditionType,MainConditionId,SubConditionId);
                    if(MainConditionType != "new"){
                        newConditionBox +=`<button class="button-6" data-remove="${MainConditionId}" style="margin-left:auto; right margin-top: auto;" id="infoMainConditionType${MainConditionNumber}">${MainConditionType}</button>`;
                    }else{

                    }
                    newConditionBox +=`<div class="container CBorder" >`;
                    newConditionBox += `<div id="${MainConditionId}" data-mainconditiontype="${MainConditionType}" class="ConditiosData" >`;
                    newConditionBox += newConditionBoxIn;
                    newConditionBox += `</div>`;
                    newConditionBox += `
                    <div class="container" id="co${SubConditionNumber}">
                        <div class="conditionButton">
                            <button name="newCondition" class="button-6 newSubConditionButton${MainConditionId}" data-mainconditionid="${MainConditionId}" data-mainnumber="${MainConditionNumber}" data-subconditiontype="AND">
                                + AND
                            </button>
                            <button name="newCondition" class="button-6 newSubConditionButton${MainConditionId} orC" data-mainconditionid="${MainConditionId}"  data-mainnumber="${MainConditionNumber}" data-subconditiontype="OR">
                                + OR
                            </button>
                        </div>
                    </div>
                    `;
                    newConditionBox +=`<button class="cleanButton remove" data-remove="${MainConditionId}"><img style="width: 45px;" src="assets/delete_recycle_remove_trash_icon.svg" /></button>`;
                    newConditionBox += `</div>`;
                    div.innerHTML = newConditionBox;
                
             


                    
                    //$('#containerOf' + MainConditionId).append(newConditionBoxIn);

                    $('#showConditions').append(div);
                    
                    $('#type_' + SubConditionId).change(function(){
                        var val = $(this).val();
                        $(`#infoCondition${SubConditionId}`).attr('data-type',val);
                        var tableVal = val.split(".")[0];
                        $(`#infoCondition${SubConditionId}`).attr('data-table',tableVal);
                            
                        
                    });
        
                    $('#operator_' + SubConditionId).change(function(){
                        var val = $(this).val();
                        $(`#infoCondition${SubConditionId}`).attr('data-operator',val);
                    });
                    $('#value_' + SubConditionId).change(function(){
                        var val = $(this).val();
                        $(`#infoCondition${SubConditionId}`).attr('data-value',val);
                    });

                    $(`.newSubConditionButton${MainConditionId}`).click(function(){
                        // var data_mainconditionid = this.getAttribute("data-mainconditionid");
                        // var data_mainconditionnumber = this.getAttribute("data-mainnumber");
                        // var data_subnumber = this.getAttribute("data-subnumber");

                        // data_subnumber++;
                      

                        MainConditionNumber = this.getAttribute("data-mainnumber");
                        MainConditionId = this.getAttribute("data-mainconditionid");
                        // SubConditionNumber = data_subnumber;
                        // SubConditionId = 'c' + data_mainconditionid + '-' + data_subnumber;
                        mainarrsubnumber[MainConditionNumber]++;
                        SubConditionNumber = mainarrsubnumber[MainConditionNumber];
                        SubConditionId = MainConditionId + '-' + SubConditionNumber;

                        console.log("SubConditionId" + SubConditionId + "|MainConditionNumber" + MainConditionNumber + "|SubConditionNumber" + SubConditionNumber + "|MainConditionId" + MainConditionId + "|SubConditionId" + SubConditionId);


                        var SubConditionType = this.getAttribute("data-subconditiontype");



                        newConditionBoxIn = newSubCondition(MainConditionNumber,SubConditionNumber,SubConditionType,MainConditionId,SubConditionId);
                        $('#'+MainConditionId).append(newConditionBoxIn);

                        var subcon_number = `${MainConditionId}-${SubConditionNumber}`;

                    
                        $('#showConditions').append(div);
                    
                        $('#type_' + SubConditionId).change(function(){
                            var val = $(this).val();
                            $(`#infoCondition${SubConditionId}`).attr('data-type',val);
                            var tableVal = val.split(".")[0];
                            $(`#infoCondition${SubConditionId}`).attr('data-table',tableVal);
                                
                            
                        });
            
                        $('#operator_' + SubConditionId).change(function(){
                            var val = $(this).val();
                            $(`#infoCondition${SubConditionId}`).attr('data-operator',val);
                        });
                        $('#value_' + SubConditionId).change(function(){
                            var val = $(this).val();
                            $(`#infoCondition${SubConditionId}`).attr('data-value',val);
                        });

                        $('.removeIn').click(function(){
                            var removeDivIdIn = this.getAttribute('data-remove'); 
                            $('#Bitwise'+removeDivIdIn).remove();
                            $('#'+removeDivIdIn).remove();
                            $('#infoCondition'+removeDivIdIn).remove();
                            
                            //SubConditionNumber--;
                            //mainarrsubnumber[MainConditionNumber]--;
                        });
                    });




                    $('.remove').click(function(){
                        var removeDivId = this.getAttribute('data-remove'); 
                        $('.'+removeDivId).remove();
                        MainConditionNumber--;
                    });
    });

    
    $('.new').click(function(){


        var numAllfromItemLoop = 0,conditiontype,operatortype,line;
        
        var Order = "";
        var OrderItem = "";
        var isInDE = "";
        var lines = "";
        
        var AllfromItem = $(".ConditiosData").map(function() {
            var childs = $(this).find('.ConditiosDataIn');
            
            var sublines = "";
            childs.each(function(i){

                
                console.log(childs[i]);
                console.log(childs[i].getAttribute('data-type'));
                console.log(childs[i].getAttribute('data-subconditiontype'));
                console.log(childs[i].getAttribute('data-operator'));

                if(childs[i].getAttribute('data-operator') == "LIKE"){
                    valueX = `%${childs[i].getAttribute('data-value')}%`;
                }else{
                    valueX = `${childs[i].getAttribute('data-value')}`;
                }
                if(childs[i].getAttribute('data-subconditiontype') == 0){
                    subconditiontype = "";
                }else{
                    subconditiontype = childs[i].getAttribute('data-subconditiontype');
                }

                dataType = childs[i].getAttribute('data-type');
                if(childs[i].getAttribute('data-type') != 0){
                    sublines += ` ${subconditiontype} ${childs[i].getAttribute('data-type')} ${childs[i].getAttribute('data-operator')} '${valueX}'`;
                }
                 console.log(sublines);
                
                
            });


            conditiontype = this.getAttribute('data-mainconditiontype');
            
            operatortype = this.getAttribute('data-operator');
            dataTable = this.getAttribute('data-table');
            
            if(conditiontype == "new"){
                lines += `(${sublines})`; 
            }else{
                lines += ` ${conditiontype} (${sublines}) `; 
            }
            
            numAllfromItemLoop++;
            //console.log(line);
            return `${dataTable}|${line}`;
        }).get();
        console.log(lines + "lines");
        var errorEx = 0;


       
        
        // create a new instance of the QueryBuilder class
        const qb = new QueryBuilder(fieldsConfig);
       
        // call the queryAudienceOrderProduct method with your desired parameters
        let query = 0;
        var Count = 0;
        
        var cString = Order +" "+ OrderItem + " " + isInDE;
        console.log("  תנאי ");
        console.log(cString);
        var c = cString.split(' ').slice(1).join(' ');
        console.log("מחיקה מילה ראשונה תנאי");
        console.log(c);

            query = qb.AudienceMasterQuery(lines);
            
        
        
            typeval = this.getAttribute('data-typeval');


            if(typeval == "sql"){
                $('#displayRes').html(query);
                $('#displayRes').show();
            }else{
                
            }
        });
    });
