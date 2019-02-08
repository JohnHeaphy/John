// Case - ccx_primarycsserviceinterestid || ccx_csserviceid
// Client Review - ccx_reviewcoordinatorid || ccx_csserviceid
// Action – do we pre-populate this as it won’t necessarily be carried out by the coordinator? - ccx_staffmember ||
// Case log – as with the Action this can be volunteer/coordinator or both - ccx_primarycsserviceinterestid || ccx_csserviceid
// Referral - ccx_primarycsserviceinterestid || ccx_sourceserviceid / ccx_targetserviceid - has to be officer on destination service (I guess) as source service referrals would be created via an Action BUT it's something you'd need to enter manually so maybe not valid for a referral?)
// Service log - ccx_primarycsserviceinterestid || ccx_csserviceid
// LAS Grant - internal application only - ccx_applicantuserid || no service record...


// -	Pass through name of field need to populate 
// -	Create generic function
// -	Service needs to be referenced on form
// -	context.getUserId()  (used in Contracts)


//Generic

function GetOfficer(whenDone, csserviceid, userid)
{
	var coordinator_match = 0;
	
	var csserviceid = Xrm.Page.getAttribute("ccx_csserviceid").getValue()[0].id;
	csserviceid = csserviceid.replace('{', "'");
	csserviceid = csserviceid.replace('}', "'");
	var userid = Xrm.Page.context.getUserId();
	userid = userid.replace('{', "'");
	userid = userid.replace('}', "'");

	//alert("service id = " + csserviceid);
	//alert("user id = " + userid);
	//alert("/XRMServices/2011/OrganizationData.svc/Ccx_csserviceinterestSet?$select=ccx_csserviceid,Ccx_csserviceinterestId,Ccx_Type,ccx_userid,Ccx_name&$filter=ccx_csserviceid/Id eq (guid"+csserviceid+") and ccx_userid/Id eq (guid"+userid+")");

	var req = new XMLHttpRequest(); //the guids below for service and user ids will need to be generic - for now setting specific ones
	req.open("GET", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/Ccx_csserviceinterestSet?$select=ccx_csserviceid,Ccx_csserviceinterestId,Ccx_Type,ccx_userid,Ccx_name&$filter=ccx_csserviceid/Id eq (guid"+csserviceid+") and ccx_userid/Id eq (guid"+userid+") and Ccx_Type/Value eq 1", true);   //Ccx_Type&$filter=Ccx_Type/Value eq (1)

	req.setRequestHeader("Accept", "application/json");
	req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	req.onreadystatechange = function () 
	{
		if (this.readyState === 4) 
		{
			this.onreadystatechange = null;
			if (this.status === 200) //200 = html - request successful
			{
				var Ccx_csserviceinterestId;	 
				var Ccx_name;
					
				var returned = JSON.parse(this.responseText).d;
				var results = returned.results;
				for (var i = 0; i < results.length; i++) 
				{
					Ccx_csserviceinterestId = results[i].Ccx_csserviceinterestId; //service interest record
					 
					Ccx_name = results[i].Ccx_name;
					
					coordinator_match = 1;
				
				}
				
				whenDone(Ccx_csserviceinterestId, Ccx_name, coordinator_match);
					//alert('Service Interest:' + Ccx_csserviceinterestId + ', ' + Ccx_name);
					
			}
			
			else 
			{
				alert('Here: ' + this.status + ' ' + this.statusText);
			}
		}
	};
		req.send();
}


//unless service id is the same in all entities will be specific i.e. added to each separate JS library

function GetOfficerCallBack() // called from onload in create mode
{
	var FormType = Xrm.Page.ui.getFormType();
	var csserviceid = Xrm.Page.getAttribute("ccx_csserviceid").getValue();

	if ((FormType == 1) && (csserviceid != null))
	{
		//Get id of service and user id
		var csserviceid = '';
		var userid = '';
		GetOfficer (onComplete, csserviceid, userid); // onComplete is the name of the function we want to call when the async process is completed
		
	}
}

function GetOfficerFromCase(whenDone)
{
	//alert('GetOfficerFromCase');
	
	var cscaseid = Xrm.Page.getAttribute("ccx_cscaseid").getValue()[0].id;
	cscaseid = cscaseid.replace('{', "'");
	cscaseid = cscaseid.replace('}', "'");
	
	//alert(cscaseid);
	
	var req = new XMLHttpRequest();
//	req.open("GET", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/Ccx_cscaseSet?$select=ccx_primarycsserviceinterestid", true);//&$filter=ccx_cscaseid/Id eq (guid"+cscaseid+")", true);

	req.open("GET", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/Ccx_cscaseSet?$select=ccx_primarycsserviceinterestid&$filter=Ccx_cscaseId eq (guid"+cscaseid+")", true);

	req.setRequestHeader("Accept", "application/json");
	req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	req.onreadystatechange = function () {
		if (this.readyState === 4) {
			this.onreadystatechange = null;
			if (this.status === 200) {
				
				var ccx_primarycsserviceinterestid;
				
				var returned = JSON.parse(this.responseText).d;
				var results = returned.results;
				for (var i = 0; i < results.length; i++)
				{
					 ccx_primarycsserviceinterestid = results[i].ccx_primarycsserviceinterestid;
					 
				}
				
				//alert('Hello2: ' + ccx_primarycsserviceinterestid.Id + ' ' + ccx_primarycsserviceinterestid.Name);
				whenDone(ccx_primarycsserviceinterestid.Id, ccx_primarycsserviceinterestid.Name);
			}
			else {
				alert(this.statusText);
			}
		}
	};
	req.send();

}

//-----
function GetOfficerFromService(whenDone)
{
	//alert('GetOfficerFromService');
	
	var csserviceid = Xrm.Page.getAttribute("ccx_csserviceid").getValue()[0].id;
	csserviceid = csserviceid.replace('{', "'");
	csserviceid = csserviceid.replace('}', "'");
	
	//alert(csserviceid);
	
	var req = new XMLHttpRequest();
//	req.open("GET", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/Ccx_cscaseSet?$select=ccx_primarycsserviceinterestid", true);//&$filter=ccx_cscaseid/Id eq (guid"+cscaseid+")", true);

	req.open("GET", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/Ccx_csserviceSet?$select=ccx_primarycsserviceinterestid&$filter=Ccx_csserviceId eq (guid"+csserviceid+")", true);

	req.setRequestHeader("Accept", "application/json");
	req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	req.onreadystatechange = function () {
		if (this.readyState === 4) {
			this.onreadystatechange = null;
			if (this.status === 200) {
				
				var ccx_primarycsserviceinterestid;
				
				var returned = JSON.parse(this.responseText).d;
				var results = returned.results;
				for (var i = 0; i < results.length; i++)
				{
					 ccx_primarycsserviceinterestid = results[i].ccx_primarycsserviceinterestid;
					 
				}
				
				//alert('Hello2: ' + ccx_primarycsserviceinterestid.Id + ' ' + ccx_primarycsserviceinterestid.Name);
				whenDone(ccx_primarycsserviceinterestid.Id, ccx_primarycsserviceinterestid.Name);
			}
			else {
				alert(this.statusText);
			}
		}
	};
	req.send();

}
//------


//--------------------Specific - This section needs to be adapted to reflect the local service interest field and added in to the local JS


/* function onComplete(Ccx_csserviceinterestId, Ccx_name, coordinator_match) // set value of “local” officer
{
	if (coordinator_match == 1)
	{
		alert('Match');
//		alert('Service Interest: ' + Ccx_csserviceinterestId + ' / Ccx_name: ' + Ccx_name);
		Xrm.Page.getAttribute("ccx_primarycsserviceinterestid").setValue([{ id: Ccx_csserviceinterestId, name: Ccx_name, entityType: "ccx_csserviceinterest"}]);
	}
	else
	{
		// find officer from case or service
		alert('No Match');
		GetOfficerFromCase(OnComplete2);
	}
	
} 

function OnComplete2(Ccx_csserviceinterestId, Ccx_name)
{
	alert('hello');
	Xrm.Page.getAttribute("ccx_primarycsserviceinterestid").setValue([{ id: Ccx_csserviceinterestId, name: Ccx_name, entityType: "ccx_csserviceinterest"}]);
}
*/
