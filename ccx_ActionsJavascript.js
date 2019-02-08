//Updates for the Usability project - changes on Build 29.12.17
//added block create if no Case present
//tidied up some commented out text


function form_onLoad() 
{

//block creation if there is no Case
     var CScase = Xrm.Page.getAttribute("ccx_cscaseid");
     if (CScase.getValue() == null) 
	{
         alert("Each Action must be associated with a Case.  Please re-create the Action from within a Case record."); 
        var attributes = Xrm.Page.data.entity.attributes.get();
        for (var i in attributes) 
		{
            attributes[i].setSubmitMode("never");
        }
        Xrm.Page.ui.close();
    } 
	
    DateCompleted();
    Whodunnit();
    
    if (Xrm.Page.ui.getFormType() == 1) 
	{
		SetReferralOptions();
		
        var d = new Date();
        d.setHours(0,0,0,0);
        Xrm.Page.getAttribute("ccx_dateraised").setValue(d);
    }
    else 
	{
        Xrm.Page.getControl("ccx_category").setDisabled(true);
    }

    LockRecords();
	MandatoryDetail();
}

function form_onSave(executionObj) {
    /*alert("save");
    If information provided, check that at least one of the fields has been populated*/
  /*   if (Xrm.Page.getAttribute("ccx_category").getValue() == 3) 
	{
        if (Xrm.Page.getAttribute("ccx_strokeassociationpublication").getValue() == null && Xrm.Page.getAttribute("ccx_otherinformationprovided").getValue() == null) {
            alert("Please specify what information was provided before saving");
            executionObj.getEventArgs().preventDefault();
        }
    } */
	
//If information provided && on/after go live, check that at least one of the tick boxes has been populated*/
var golive = new Date('2018-02-25'); //change to be '26/02/2018' (or go live date) at go live***
var dateraised = Xrm.Page.getAttribute("ccx_dateraised").getValue();

var m = dateraised.getMonth();
var dd = dateraised.getDate();
var y = dateraised.getFullYear();


var dateraisedformatted = new Date(y,m,dd);

//alert(dateraisedformatted);

if (Xrm.Page.getAttribute("ccx_category").getValue() == 3 &&  
	dateraisedformatted > golive &&
	Xrm.Page.getAttribute("ccx_pub_welcomepackstage1").getValue() != 1 &&
    Xrm.Page.getAttribute("ccx_pub_welcomepackstage2").getValue() != 1 &&
    Xrm.Page.getAttribute("ccx_pub_strokeassociationpublication").getValue() != 1 &&
    Xrm.Page.getAttribute("ccx_pub_externalpublicationinformation").getValue() != 1 &&
   // Xrm.Page.getAttribute("ccx_pub_dischargepack").getValue() != 1 &&
    Xrm.Page.getAttribute("ccx_pub_other").getValue() != 1) 
	{
        Xrm.Page.ui.setFormNotification('You must tick at least one publication type tick box before this Information Provided Action can be saved.', 'ERROR','1')
        
        executionObj.getEventArgs().preventDefault();
    }
    else { Xrm.Page.ui.clearFormNotification('1'); } 

 
    var namepos = 0;
    namepos = Xrm.Page.getAttribute("ccx_cscaseid").getValue()[0].name.indexOf("(");
    var name = Xrm.Page.getAttribute("ccx_cscaseid").getValue()[0].name.substr(0, namepos - 1);
    name = name + ": ";
    name = name + Xrm.Page.getAttribute("ccx_category").getSelectedOption().text;
    name = name + " - ";
    var d = Xrm.Page.getAttribute("ccx_dateraised").getValue();
    if (d.getDate() < 10) {
        name = name + "0";
    }
    name = name + d.getDate() + "/";
    if (d.getMonth() < 9) {
        name = name + "0";
    }
    name = name + (d.getMonth() + 1) + "/" + d.getFullYear();
    Xrm.Page.getAttribute("ccx_name").setValue(name);
    Xrm.Page.getAttribute("ccx_name").setSubmitMode("always");
}

//AMEND - SHOULD ALWAYS BE MANDATORY ON/AFTER GO LIVE

/*Mandatory status of Action Detail only when type = Other*/
function MandatoryDetail() 
{
    var Category = Xrm.Page.getAttribute("ccx_category").getValue();
    var FormType = Xrm.Page.ui.getFormType();
	var golive = new Date('2018-02-25'); //change to be '26/02/2018' (or go live date) at go live***
	var dateraised = Xrm.Page.getAttribute("ccx_dateraised").getValue();
	
	if (dateraised == null)
	{
		dateraised = new Date();
	}

	//alert (dateraised);

	var m = dateraised.getMonth();
	var dd = dateraised.getDate();
	var y = dateraised.getFullYear();

	var dateraisedformatted = new Date(y,m,dd);
	
    switch (Category) 
	{
        case 1: case 2:
            //Referrals and Signposting
            //Xrm.Page.getAttribute("ccx_actiondetail").setRequiredLevel("recommended");
            Xrm.Page.ui.tabs.get("Action").sections.get("Referrals").setVisible(true);
            Xrm.Page.ui.tabs.get("Action").sections.get("LASGrants").setVisible(false);
            Xrm.Page.ui.tabs.get("Action").sections.get("Information").setVisible(false);
            //remove options for Friend, Volunteer, Carer, and Family Member
            Xrm.Page.getControl("ccx_referraldestinationagency").removeOption(3018);
            Xrm.Page.getControl("ccx_referraldestinationagency").removeOption(3028);
            Xrm.Page.getControl("ccx_referraldestinationagency").removeOption(3030);
            Xrm.Page.getControl("ccx_referraldestinationagency").removeOption(3057);
            Xrm.Page.getAttribute("ccx_referraldestinationcategory").setRequiredLevel("required");
            Xrm.Page.getAttribute("ccx_referraldestinationagency").setRequiredLevel("required");

            if (FormType == 1) 
			{
                Xrm.Page.getControl("statuscode").setDisabled(false);
                Xrm.Page.getAttribute("statuscode").setValue(1);
            }
			
			if (dateraisedformatted > golive)
			{
			Xrm.Page.getAttribute("ccx_actiondetail").setRequiredLevel("required");
			}
			else
			{
			Xrm.Page.getAttribute("ccx_actiondetail").setRequiredLevel("recommended");
			}			

            if (Xrm.Page.getAttribute("ccx_referralcreated").getValue() != null) {
                Xrm.Page.getControl("ccx_referraldestinationservice").setDisabled(true);
                Xrm.Page.getControl("ccx_referralstrokeclubandgroup").setDisabled(true);
                Xrm.Page.getControl("ccx_referraldestinationagency").setDisabled(true);
                Xrm.Page.getControl("ccx_referraldestinationcategory").setDisabled(true);
            }
            else {
                SetMandatoryServiceOrGroup();
            }
            Xrm.Page.getAttribute("ccx_lasgranttype").setRequiredLevel("none");
            Xrm.Page.getAttribute("ccx_lasgrantamount").setRequiredLevel("none");
            break;
        case 3:
            // Information Provided
            //Xrm.Page.getAttribute("ccx_actiondetail").setRequiredLevel("recommended");
            Xrm.Page.ui.tabs.get("Action").sections.get("Referrals").setVisible(false);
            Xrm.Page.ui.tabs.get("Action").sections.get("LASGrants").setVisible(false);
            Xrm.Page.ui.tabs.get("Action").sections.get("Information").setVisible(true);
            Xrm.Page.getAttribute("ccx_lasgranttype").setRequiredLevel("none");
            Xrm.Page.getAttribute("ccx_lasgrantamount").setRequiredLevel("none");
            Xrm.Page.getAttribute("ccx_referraldestinationcategory").setRequiredLevel("none");
            Xrm.Page.getAttribute("ccx_referraldestinationagency").setRequiredLevel("none");

            if (FormType == 1) {
				// this is setting the status back to outstanding even if we've set a complete date
                Xrm.Page.getControl("statuscode").setDisabled(false);
                Xrm.Page.getAttribute("statuscode").setValue(100000000);
				// alert('here');
            }
			
			if (dateraisedformatted > golive)
			{
			Xrm.Page.getAttribute("ccx_actiondetail").setRequiredLevel("required");
			}
			else
			{
			Xrm.Page.getAttribute("ccx_actiondetail").setRequiredLevel("recommended");
			}
            break;
        case 4:
            //LAS Grants
            //Xrm.Page.getAttribute("ccx_actiondetail").setRequiredLevel("recommended");
            Xrm.Page.ui.tabs.get("Action").sections.get("Referrals").setVisible(false);
            Xrm.Page.ui.tabs.get("Action").sections.get("LASGrants").setVisible(true);
            Xrm.Page.ui.tabs.get("Action").sections.get("Information").setVisible(false);
            
			if (dateraisedformatted > golive)
			{
			Xrm.Page.getAttribute("ccx_actiondetail").setRequiredLevel("required");
			}
			else
			{
			Xrm.Page.getAttribute("ccx_actiondetail").setRequiredLevel("recommended");
			}
			
			/*Set Grants to Outstanding on creation*/	
			if (Xrm.Page.ui.getFormType() == 1) {
                Xrm.Page.getAttribute("statuscode").setValue(100000000);
                Xrm.Page.getControl("statuscode").setDisabled(true);
                Xrm.Page.getAttribute("statuscode").setSubmitMode("always");
                Xrm.Page.getAttribute("ccx_lasgranttype").setRequiredLevel("required");
                Xrm.Page.getAttribute("ccx_lasgrantamount").setRequiredLevel("required");
                Xrm.Page.getControl("ccx_datecompleted").setDisabled(true);
            }
            else {
                Xrm.Page.getControl("ccx_lasgranttype").setDisabled(true);
                Xrm.Page.getControl("ccx_lasgrantamount").setDisabled(true);
                Xrm.Page.getControl("statuscode").setDisabled(true);
            }
            Xrm.Page.getAttribute("ccx_referraldestinationcategory").setRequiredLevel("none");
            Xrm.Page.getAttribute("ccx_referraldestinationagency").setRequiredLevel("none");
            break;
/*         case 5:
            // MSG
            Xrm.Page.getAttribute("ccx_actiondetail").setRequiredLevel("recommended");
            Xrm.Page.ui.tabs.get("Action").sections.get("Referrals").setVisible(false);
            Xrm.Page.ui.tabs.get("Action").sections.get("LASGrants").setVisible(false);
            Xrm.Page.ui.tabs.get("Action").sections.get("Information").setVisible(false);
            Xrm.Page.getAttribute("ccx_lasgranttype").setRequiredLevel("none");
            Xrm.Page.getAttribute("ccx_lasgrantamount").setRequiredLevel("none");
            Xrm.Page.getAttribute("ccx_referraldestinationcategory").setRequiredLevel("none");
            Xrm.Page.getAttribute("ccx_referraldestinationagency").setRequiredLevel("none");
            if (FormType == 1) {
                Xrm.Page.getControl("statuscode").setDisabled(false);
                Xrm.Page.getAttribute("statuscode").setValue(1);
            }
            break; */
        default:
            // Support, Advice/Discussion and Other 
            Xrm.Page.getAttribute("ccx_actiondetail").setRequiredLevel("required");
            Xrm.Page.ui.tabs.get("Action").sections.get("Referrals").setVisible(false);
            Xrm.Page.ui.tabs.get("Action").sections.get("LASGrants").setVisible(false);
            Xrm.Page.ui.tabs.get("Action").sections.get("Information").setVisible(false);
            Xrm.Page.getAttribute("ccx_lasgranttype").setRequiredLevel("none");
            Xrm.Page.getAttribute("ccx_lasgrantamount").setRequiredLevel("none");
            Xrm.Page.getAttribute("ccx_referraldestinationcategory").setRequiredLevel("none");
            Xrm.Page.getAttribute("ccx_referraldestinationagency").setRequiredLevel("none");
            if (FormType == 1) {
                Xrm.Page.getControl("statuscode").setDisabled(false);
                Xrm.Page.getAttribute("statuscode").setValue(100000000);
				
            }
            break;
			
	}

	DateCompleted();
}

/*Date Completed only relevant when action is complete*/
function DateCompleted() {
    if (Xrm.Page.getAttribute("statuscode").getValue() == 1) {
        Xrm.Page.getControl("ccx_datecompleted").setDisabled(false);
        Xrm.Page.getAttribute("ccx_datecompleted").setRequiredLevel("required");

    }
    else {
        Xrm.Page.getAttribute("ccx_datecompleted").setValue();
        Xrm.Page.getAttribute("ccx_datecompleted").setRequiredLevel("none");
        Xrm.Page.getControl("ccx_datecompleted").setDisabled(true);
        Xrm.Page.getAttribute("ccx_datecompleted").setSubmitMode("always");
    }
}

/*Switch availability of 'who did it?' fields based on a single switch*/
function Whodunnit() 
{
    var Who = Xrm.Page.getAttribute("ccx_actioncarriedoutby").getValue();
    switch (Who) {
        case 1: /*Done by staff member*/
            Xrm.Page.getControl("ccx_staffmember").setDisabled(false);
            Xrm.Page.getAttribute("ccx_staffmember").setRequiredLevel("required");
            Xrm.Page.getControl("ccx_volunteer").setDisabled(false);
            Xrm.Page.getAttribute("ccx_volunteer").setRequiredLevel("none");
            Xrm.Page.getAttribute("ccx_actionother").setValue();
            Xrm.Page.getControl("ccx_actionother").setDisabled(true);
            Xrm.Page.getAttribute("ccx_actionother").setSubmitMode("always");
            break;
        case 2: /*Done by Volunteer*/
            Xrm.Page.getControl("ccx_staffmember").setDisabled(false);
            Xrm.Page.getAttribute("ccx_staffmember").setRequiredLevel("none");
            Xrm.Page.getControl("ccx_volunteer").setDisabled(false);
            Xrm.Page.getAttribute("ccx_volunteer").setRequiredLevel("required");
            Xrm.Page.getAttribute("ccx_actionother").setValue();
            Xrm.Page.getControl("ccx_actionother").setDisabled(true);
            Xrm.Page.getAttribute("ccx_actionother").setSubmitMode("always");
            break;
        case 3: /*Action done by Client*/
            Xrm.Page.getAttribute("ccx_staffmember").setValue();
            Xrm.Page.getAttribute("ccx_staffmember").setRequiredLevel("none");//cm
			Xrm.Page.getControl("ccx_staffmember").setDisabled(true);
            Xrm.Page.getAttribute("ccx_staffmember").setSubmitMode("always");
            Xrm.Page.getAttribute("ccx_volunteer").setValue();
			Xrm.Page.getAttribute("ccx_volunteer").setRequiredLevel("none");//cm
            Xrm.Page.getControl("ccx_volunteer").setDisabled(true);
            Xrm.Page.getAttribute("ccx_volunteer").setSubmitMode("always");
            Xrm.Page.getAttribute("ccx_actionother").setValue();
            Xrm.Page.getControl("ccx_actionother").setDisabled(true);
            Xrm.Page.getAttribute("ccx_actionother").setSubmitMode("always");
            break;
        case 4: /*Action done by Other*/
            Xrm.Page.getAttribute("ccx_staffmember").setValue();
            Xrm.Page.getControl("ccx_staffmember").setDisabled(true);
            Xrm.Page.getAttribute("ccx_staffmember").setSubmitMode("always");
            Xrm.Page.getAttribute("ccx_staffmember").setRequiredLevel("none");
            Xrm.Page.getAttribute("ccx_volunteer").setValue();
            Xrm.Page.getControl("ccx_volunteer").setDisabled(true);
            Xrm.Page.getAttribute("ccx_volunteer").setSubmitMode("always");
            Xrm.Page.getControl("ccx_actionother").setDisabled(false);
            Xrm.Page.getAttribute("ccx_actionother").setRequiredLevel("required");
            break;
        default:
            alert("An unexpected Action Carried Out By value has been recorded - please contact IT");
    }
    VolunteerTime();
}

/*Volunteer time only relevant when we have a volunteer - but then mandatory*/
function VolunteerTime() {
    if (Xrm.Page.getAttribute("ccx_volunteer").getValue() != null) {
        Xrm.Page.getControl("ccx_volunteertime").setDisabled(false);
        Xrm.Page.getAttribute("ccx_volunteertime").setRequiredLevel("required");
    }
    else {
        Xrm.Page.getAttribute("ccx_volunteertime").setValue();
        Xrm.Page.getControl("ccx_volunteertime").setDisabled(true);
        Xrm.Page.getAttribute("ccx_volunteertime").setSubmitMode("always");
    }
}

/*Set the Destination Agency based on the Destination Category, for a referral or signposting*/
function SetReferralOptions() 
{
    /*alert ("starting referral function");*/
    var requiredlevel = 'none';
    var storedvalue = Xrm.Page.getAttribute("ccx_referraldestinationagency").getValue();
    var low = Xrm.Page.getAttribute("ccx_referraldestinationcategory").getValue();
    var low = low * 1000;
    var high = low + 999;
    var validtest = 0;
    var agencylist = Xrm.Page.getAttribute("ccx_referraldestinationagency");
    var length = agencylist.getOptions().length;
    Xrm.Page.getControl("ccx_referraldestinationagency").clearOptions();
    for (i = 0; i < length; i++) {
        var currentvalue = agencylist.getOptions()[i].value;
        /*alert("low = " + low + " and high is " + high + " and value is " + currentvalue);*/
        if (currentvalue >= low && currentvalue <= high && currentvalue != 4004 && currentvalue != 3018 && currentvalue != 3028 && currentvalue != 3030 && currentvalue != 3057) /*Exclude LAS Grants, Carer, Volunteer, Family Member, Friend*/
        {
            var optn1 = new Object();
            optn1.text = agencylist.getOptions()[i].text;
            optn1.value = currentvalue;
            Xrm.Page.getControl("ccx_referraldestinationagency").addOption(optn1);
            if (currentvalue == storedvalue) {
                validtest = 1;
                /* alert("currentvalue of " + currentvalue + " is valid");*/
            }
        }
    }
    if (validtest == 1) {
        Xrm.Page.getAttribute("ccx_referraldestinationagency").setValue(storedvalue);
    }
    else {
        if (Xrm.Page.getAttribute("ccx_referraldestinationcategory").getValue() == 4) {
            Xrm.Page.getAttribute("ccx_referraldestinationagency").setValue(4001);

        }
        else {
            Xrm.Page.getAttribute("ccx_referraldestinationagency").setValue(0);
        }
    }
    SetMandatoryServiceOrGroup();
}

function CheckStrokeClub() 
{
    if (Xrm.Page.getAttribute("ccx_referralstrokeclubandgroup").getValue() != null) 
        {
        var counter = 0;
        var nametext = Xrm.Page.getAttribute("ccx_referralstrokeclubandgroup").getValue()[0].name;
        for (i = 0; i <= nametext.length; i = i + 1) 
            {
            if (nametext.charAt(i) == "/") {
                counter = counter + 1;
            }
        }
        switch (Xrm.Page.getAttribute("ccx_referraldestinationagency").getText())
         {
          case "Stroke Club":
          if (counter != 1)
            {
             alert("You have not selected an appropriate Stroke Club.  Please check and try again.");
             Xrm.Page.getAttribute("ccx_referralstrokeclubandgroup").setValue(null);
            }
          break;
   
          case "Stroke Association Voluntary Group":
          if (counter != 3)
            {
             alert("You have not selected an appropriate Voluntary Group.  Please check and try again.");
             Xrm.Page.getAttribute("ccx_referralstrokeclubandgroup").setValue(null);
            }
         break;
                  
         case "Speakability Group":
         if (counter != 4)
            {
             alert("You have not selected an appropriate Speakability Group.  Please check and try again.");
             Xrm.Page.getAttribute("ccx_referralstrokeclubandgroup").setValue(null);
            }
         break;
   
//         default:
//             alert("Error - Stroke Club and Group selected but not an appropriate destination agency.");
//             Xrm.Page.getAttribute("ccx_referralstrokeclubandgroup").setValue(null);
       
       }
    }
}

function CheckService() {
    if (Xrm.Page.getAttribute("ccx_referraldestinationagency").getValue() == 4001 && Xrm.Page.getAttribute("ccx_referraldestinationservice").getValue() != null) {
        if (Xrm.Page.getAttribute("ccx_csserviceid").getValue()[0].id == Xrm.Page.getAttribute("ccx_referraldestinationservice").getValue()[0].id) {
            alert('You cannot refer to the service that the case is already on.');
            Xrm.Page.getAttribute("ccx_referraldestinationservice").setValue();
        }
    }
}

function SetMandatoryServiceOrGroup() {
    var destinationagency = Xrm.Page.getAttribute("ccx_referraldestinationagency").getValue();
//alert("destination agency" + destinationagency);    
switch (destinationagency) 
	{
        case 4001:
            Xrm.Page.getControl("ccx_referraldestinationservice").setDisabled(false);
            Xrm.Page.getAttribute("ccx_referraldestinationservice").setRequiredLevel("required");
            Xrm.Page.getAttribute("ccx_referralstrokeclubandgroup").setValue(null);
			Xrm.Page.getAttribute("ccx_referralstrokeclubandgroup").setRequiredLevel("none");//cm
            Xrm.Page.getControl("ccx_referralstrokeclubandgroup").setDisabled(true);
            Xrm.Page.getAttribute("ccx_referralstrokeclubandgroup").setSubmitMode("always");
            break;
        case 4002:
        case 4003:
        case 4007:

//alert("club or group");
            Xrm.Page.getControl("ccx_referralstrokeclubandgroup").setDisabled(false);
            Xrm.Page.getAttribute("ccx_referralstrokeclubandgroup").setRequiredLevel("required");           
            Xrm.Page.getAttribute("ccx_referraldestinationservice").setValue(null);
			Xrm.Page.getAttribute("ccx_referraldestinationservice").setRequiredLevel("none");//cm
            Xrm.Page.getControl("ccx_referraldestinationservice").setDisabled(true);
            Xrm.Page.getAttribute("ccx_referraldestinationservice").setSubmitMode("always");
            break;
        default:
        //alert("default");

//        Xrm.Page.getAttribute("ccx_referraldestinationservice").setValue(null);
           Xrm.Page.getAttribute("ccx_referraldestinationservice").setRequiredLevel("none");//CM added
           Xrm.Page.getControl("ccx_referraldestinationservice").setDisabled(true);
           Xrm.Page.getAttribute("ccx_referraldestinationservice").setSubmitMode("always");
           Xrm.Page.getAttribute("ccx_referralstrokeclubandgroup").setValue(null);
           Xrm.Page.getAttribute("ccx_referralstrokeclubandgroup").setRequiredLevel("none");//CM added
           Xrm.Page.getControl("ccx_referralstrokeclubandgroup").setDisabled(true);
           Xrm.Page.getAttribute("ccx_referralstrokeclubandgroup").setSubmitMode("always");
            break;
    }
}

function LockRecords() {
    var StatusReason = Xrm.Page.getAttribute("statuscode").getValue();
    var VollActivity = Xrm.Page.getAttribute("ccx_volunteeractivityid").getValue();
    var FormType = Xrm.Page.ui.getFormType();
    var Category = Xrm.Page.getAttribute("ccx_category").getValue();

    if (VollActivity != null) {
        Xrm.Page.getControl("ccx_volunteer").setDisabled(true);
        Xrm.Page.getControl("ccx_volunteertime").setDisabled(true); 
        Xrm.Page.getControl("ccx_actioncarriedoutby").setDisabled(true);
    }

    if (StatusReason != 100000000 && FormType != 1 && (Category == 1 || Category == 2 || Category == 4)) {
        formdisable('true');
    }

    if (Category == 4 && FormType != 1) {
    formdisable('true');
    }

}

function DateCheck() 
{
	
    var RaisedDate = Xrm.Page.getAttribute("ccx_dateraised").getValue();

	var dateFieldValue= Xrm.Page.getAttribute('ccx_dateraised').getValue();

    var Today = new Date();
    var CheckDate = Xrm.Page.getAttribute("ccx_datecompleted").getValue();
    //alert ("ConDate = " + ConcludedDate);
    if (CheckDate > Today) 
       {
        alert("You cannot select a Completed Date in the future\nPlease Select a Valid Date");
        Xrm.Page.data.entity.attributes.get("ccx_datecompleted").setValue(Today);
       }
	if(RaisedDate != null)
	{
		var RaisedDate = Xrm.Page.getAttribute("ccx_dateraised").getValue();
		
		RaisedDate.setHours(00,00,00);

		if (CheckDate < RaisedDate)
		  {
			alert("You can not select a Completed date before the Date Raised \nPlease Select a Valid Date");
		  //alert("You can not select a Completed date (" + CheckDate + ") before the Date Raised (" + RaisedDate + ")\nPlease Select a Valid Date");
			Xrm.Page.data.entity.attributes.get("ccx_datecompleted").setValue(Today);
		}
	}
}


function formdisable(disablestatus) {
    var allAttributes = Xrm.Page.data.entity.attributes.get();
    for (var i in allAttributes) {
        var myattribute = Xrm.Page.data.entity.attributes.get(allAttributes[i].getName());
        var myname = myattribute.getName();
        if (Xrm.Page.getControl(myname) != null) Xrm.Page.getControl(myname).setDisabled(disablestatus);
    }
}  

function SetToOutstanding()
{
   var Today = new Date();

if (Xrm.Page.getAttribute("ccx_targetdate").getValue() > Today)
  {
   Xrm.Page.getAttribute("statuscode").setValue(100000000);
   DateCompleted();
  }
}

//--------------------------------------------------------------------------------------------------------------------------------
// save and new section
function OnSaveError()
{
	// this will be called if the onSave fails for a valid reason - e.g. a mandatory field isn't specified so
	// adding an alert is not appropriate
	
	// alert('OnSave event failed during Save And New attempt');
}

function SaveAndNew()
{
	//alert('Pre SaveAndNew promise');
	
	Xrm.Page.data.save().then(OpenNewForm, OnSaveError);
}

function OpenNewForm()
{
	
	//alert('OpenNewForm');
	
	var windowOptions = {
	 openInNewWindow: false
	};
	
	var parameters = {};
	
	var CaseID = Xrm.Page.data.entity.attributes.get("ccx_cscaseid").getValue()[0].id;
	var CaseName = Xrm.Page.data.entity.attributes.get("ccx_cscaseid").getValue()[0].name;
	//alert('CaseID: ' + CaseID + ' / CaseName: ' + CaseName);
	
	var ServiceID = Xrm.Page.data.entity.attributes.get("ccx_csserviceid").getValue()[0].id;
	var ServiceName = Xrm.Page.data.entity.attributes.get("ccx_csserviceid").getValue()[0].name;
	//alert('ServiceID: ' + ServiceID + ' / ServiceName: ' + ServiceName);

	var ActionCarriedOutBy = Xrm.Page.data.entity.attributes.get("ccx_actioncarriedoutby").getValue();
	//alert('ActionCarriedOutBy: ' + ActionCarriedOutBy);
	
	if(ActionCarriedOutBy == 1) // get staff member
	{
		var StaffMemberCtrl = Xrm.Page.data.entity.attributes.get("ccx_staffmember");
		
		if(StaffMemberCtrl != null)
		{
			//alert('StaffMemberCtrl != null');
			
			var StaffMemberID = Xrm.Page.data.entity.attributes.get("ccx_staffmember").getValue()[0].id;
			var StaffMemberName = Xrm.Page.data.entity.attributes.get("ccx_staffmember").getValue()[0].name;
			//alert('StaffMemberID: ' + StaffMemberID + ' / StaffMemberName: ' + StaffMemberName);
		
			parameters["ccx_staffmember"] = StaffMemberID;
			parameters["ccx_staffmembername"] = StaffMemberName;
		}
	}
	
	if(ActionCarriedOutBy == 2) // volunteer
	{
		var VolunteerCtrl = Xrm.Page.data.entity.attributes.get("ccx_volunteer");
		
		if(VolunteerCtrl != null)
		{
			//alert('VolunteerCtrl != null');
			
			var VolunteerID = Xrm.Page.data.entity.attributes.get("ccx_volunteer").getValue()[0].id;
			var VolunteerName = Xrm.Page.data.entity.attributes.get("ccx_volunteer").getValue()[0].name;
			//alert('VolunteerID: ' + VolunteerID + ' / VolunteerName: ' + VolunteerName);
		
			parameters["ccx_volunteer"] = VolunteerID;
			parameters["ccx_volunteername"] = VolunteerName;
		}
	}
	
	var ccx_dateraised = Xrm.Page.data.entity.attributes.get("ccx_dateraised").getValue();
	ccx_dateraised = yyyymmdd(ccx_dateraised);
	//alert('ccx_dateraised: ' + ccx_dateraised);
	
	var entityName = "ccx_action";
	
	parameters["ccx_cscaseid"] = CaseID;
	parameters["ccx_cscaseidname"] = CaseName;

	parameters["ccx_csserviceid"] = ServiceID;
	parameters["ccx_csserviceidname"] = ServiceName;
	
	parameters["ccx_actioncarriedoutby"] = ActionCarriedOutBy;
	
	parameters["ccx_dateraised"] = ccx_dateraised;	
	
	parameters["ccx_openedfromsaveandnew"] = true;
	
	Xrm.Utility.openEntityForm(entityName, null, parameters, windowOptions);
	
}

function SaveAndClose2(PrimaryControl)
{	
	//alert('Pre SaveAndClose2 promise');
		
	Xrm.Page.data.save().then(CloseForm(PrimaryControl), OnSaveError);
}

function CloseForm(PrimaryControl)
{
	alert('CloseForm: ' + PrimaryControl);
	
	Xrm.Page.data.entity.save('saveandclose');
	
}

function yyyymmdd(this_date)
{
	var mm = this_date.getMonth() + 1;
	var dd = this_date.getDate();

	return [this_date.getFullYear(),
			(mm > 9 ? '' : '0') + mm,
			(dd > 9 ? '' : '0') + dd
	].join('-');
};


function onComplete(Ccx_csserviceinterestId, Ccx_name, coordinator_match) // set value of local officer
{
	if (coordinator_match == 1)
	{
		//alert('Match');
		//alert('Service Interest: ' + Ccx_csserviceinterestId + ' / Ccx_name: ' + Ccx_name);
		Xrm.Page.getAttribute("ccx_staffmember").setValue([{ id: Ccx_csserviceinterestId, name: Ccx_name, entityType: "ccx_csserviceinterest"}]);
	}
	else
	{
		// find officer from case or service
		//alert('No Match2');
		GetOfficerFromService(OnComplete2);
	}	
	
}

function OnComplete2(Ccx_csserviceinterestId, Ccx_name)
{
	//alert('hello');
	Xrm.Page.getAttribute("ccx_staffmember").setValue([{ id: Ccx_csserviceinterestId, name: Ccx_name, entityType: "ccx_csserviceinterest"}]);
}

