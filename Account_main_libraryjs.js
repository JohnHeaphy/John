function OnLoad()
{
Funder_Type();

var FormType = Xrm.Page.ui.getFormType();

    if (FormType == 1)
    {
    var add1name = Xrm.Page.getAttribute("address1_name");
    add1name.setValue("Main Address");
    add1name.setSubmitMode("always");
    }

}// End OnLoad

function Funder_Type()
{
var Rag = Xrm.Page.getAttribute("ccx_funder_type").getValue(); 

    if (Rag != 4)
    {
     Xrm.Page.getControl("ccx_funder_type").removeOption(4);    
    }
}

//add on change for each commissioner field

function OnChange_PrimaryCommissioner()
{
            var PCommissioner = Xrm.Page.getAttribute("ccx_servicesprimarycommissioner").getValue();
            
            if(PCommissioner == null)
            {
                        // set PContact to null
                        Xrm.Page.data.entity.attributes.get("primarycontactid").setValue(null);
                        Xrm.Page.data.entity.attributes.get("primarycontactid").setSubmitMode("always");
                        
            }
            else
            {
                        var PCommissionerID = PCommissioner[0].id;
                        
                        // set PContact from retrieved record
                        
                        var req = new XMLHttpRequest();
                        req.open("GET", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/ccx_commissionerSet(guid'" + PCommissionerID + "')?$select=ccx_contact", false);
                        req.setRequestHeader("Accept", "application/json");
                        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                        req.onreadystatechange = function () {
                                    if (this.readyState === 4) {
                                                this.onreadystatechange = null;
                                                if (this.status === 200) {
                                                            var result = JSON.parse(this.responseText).d;
                                                            var ccx_contact = result.ccx_contact;
                                                            
//                                                          var output = '';
//                                                          for (var property in ccx_contact)
//                                                          {
//                                                                      output += property + ': ' + ccx_contact[property] + '; ';
//                                                          }
//                                                          alert(output);
                                                            
                                                    var lookup = new Array();
                                                            lookup[0] = new Object();
                                                            lookup[0].id =  ccx_contact.Id;
                                                            lookup[0].name = ccx_contact.Name;
                                                            lookup[0].entityType = 'contact';
                                                            Xrm.Page.getAttribute("primarycontactid").setValue(lookup);
                                                            Xrm.Page.data.entity.attributes.get("primarycontactid").setSubmitMode("always");
                                                            
                                                }
                                                else
                                                {
                                                            alert(this.statusText);
                                                }
                                    }
                        };
                        req.send();
            }
            
}

function OnChange_InvoiceCommissioner()
{
            var ICommissioner = Xrm.Page.getAttribute("ccx_servicesinvoicecommissioner").getValue();
            
            if(ICommissioner == null)
            {
                        // set IContact to null
                        Xrm.Page.data.entity.attributes.get("ccx_invoice_contactid").setValue(null);
                        Xrm.Page.data.entity.attributes.get("ccx_invoice_contactid").setSubmitMode("always");
                        
            }
            else
            {
                        var ICommissionerID = ICommissioner[0].id;
                        
                        // set IContact from retrieved record
                        
                        var req = new XMLHttpRequest();
                        req.open("GET", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/ccx_commissionerSet(guid'" + ICommissionerID + "')?$select=ccx_contact", false);
                        req.setRequestHeader("Accept", "application/json");
                        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                        req.onreadystatechange = function () {
                                    if (this.readyState === 4) {
                                                this.onreadystatechange = null;
                                                if (this.status === 200) {
                                                            var result = JSON.parse(this.responseText).d;
                                                            var ccx_contact = result.ccx_contact;
                                                            
//                                                          var output = '';
//                                                          for (var property in ccx_contact)
//                                                          {
//                                                                      output += property + ': ' + ccx_contact[property] + '; ';
//                                                          }
//                                                          alert(output);
                                                            
                                                    var lookup = new Array();
                                                            lookup[0] = new Object();
                                                            lookup[0].id =  ccx_contact.Id;
                                                            lookup[0].name = ccx_contact.Name;
                                                            lookup[0].entityType = 'contact';
                                                            Xrm.Page.getAttribute("ccx_invoice_contactid").setValue(lookup);
                                                            Xrm.Page.data.entity.attributes.get("ccx_invoice_contactid").setSubmitMode("always");
                                                            
                                                }
                                                else
                                                {
                                                            alert(this.statusText);
                                                }
                                    }
                        };
                        req.send();
            }
            
}

/* Debtor Code format must be Dxxx99 */

function Debtor_Code(trigger)
{
//alert ("in Debtor_Code \nTrigger="+trigger);
DC=Xrm.Page.getAttribute("accountnumber").getValue(); 
DC_valid=true;

// alert("Debtor Code= "+DC);
    if (DC.length !=6)
        DC_valid=false;
    else
         {
         if (DC.charAt(0)!='D') DC_valid=false;
         if (DC.charAt(1)<'A') DC_valid=false;
         if (DC.charAt(1)>'Z') DC_valid=false;
         if (DC.charAt(2)<'A') DC_valid=false;
         if (DC.charAt(2)>'Z') DC_valid=false;
         if (DC.charAt(3)<'A') DC_valid=false;
         if (DC.charAt(3)>'Z') DC_valid=false;
         if (DC.charAt(4)<'0') DC_valid=false;
         if (DC.charAt(4)>'9') DC_valid=false;
         if (DC.charAt(5)<'0') DC_valid=false;
         if (DC.charAt(5)>'9') DC_valid=false;

         }
//alert("Result= "+DC_valid);
if  (DC_valid)
    Xrm.Page.getControl("accountnumber").clearNotification();
else
    Xrm.Page.getControl("accountnumber").setNotification("Must be in the format Dxxx99 where x=alphabetic and 9=digit");

} // end of Debtor_Code

/* warn of comma in the invoice address */

function Comma_In_Address()
{
var comma_problem = false;
var uniqueId = "address_has_comma"; // message identifier
//    alert(Xrm.Page.getAttribute("ccx_invoice_line1").getValue());
    if (Xrm.Page.getAttribute("ccx_invoice_department").getValue() != null)
        if (Xrm.Page.getAttribute("ccx_invoice_department").getValue().indexOf(',') != -1)
            comma_problem = true;
    if (Xrm.Page.getAttribute("ccx_invoice_line1").getValue() != null)
        if (Xrm.Page.getAttribute("ccx_invoice_line1").getValue().indexOf(',') != -1)
            comma_problem = true;
    if (Xrm.Page.getAttribute("ccx_invoice_line2").getValue() != null)
        if (Xrm.Page.getAttribute("ccx_invoice_line2").getValue().indexOf(',') != -1)
            comma_problem = true;
    if (Xrm.Page.getAttribute("ccx_invoice_line3").getValue() != null)
        if (Xrm.Page.getAttribute("ccx_invoice_line3").getValue().indexOf(',') != -1)
            comma_problem = true;
    if (Xrm.Page.getAttribute("ccx_invoice_city").getValue() != null)
        if (Xrm.Page.getAttribute("ccx_invoice_city").getValue().indexOf(',') != -1)
            comma_problem = true;
    if (Xrm.Page.getAttribute("ccx_invoice_stateorprovince").getValue() != null)
        if (Xrm.Page.getAttribute("ccx_invoice_stateorprovince").getValue().indexOf(',') != -1)
            comma_problem = true;
    if (Xrm.Page.getAttribute("ccx_invoice_postalcode").getValue() != null)
        if (Xrm.Page.getAttribute("ccx_invoice_postalcode").getValue().indexOf(',') != -1)
            comma_problem = true;

    if (comma_problem)
        Xrm.Page.ui.setFormNotification("The Invoice Address contains a comma ", "WARNING",uniqueId);
    else
       Xrm.Page.ui.clearFormNotification(uniqueId); 
}
