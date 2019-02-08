function OpenNewAction(ActionID)
{
	var FormType = window.parent.Xrm.Page.ui.getFormType();
	
	if (FormType == 1) // create
	{
		alert("Please save the case before adding Actions");
	}
	else
	{

		var CaseID = window.parent.Xrm.Page.data.entity.getId();
		// remove curly brackets
		CaseID = CaseID.replace('{', '');
		CaseID = CaseID.replace('}', '');
		var CaseName = window.parent.Xrm.Page.getAttribute("ccx_name").getValue();
	
		var ServiceID = window.parent.Xrm.Page.data.entity.attributes.get("ccx_csserviceid").getValue()[0].id;
		// remove curly brackets
		ServiceID = ServiceID.replace('{', '');
		ServiceID = ServiceID.replace('}', '');
		var ServiceName = window.parent.Xrm.Page.data.entity.attributes.get("ccx_csserviceid").getValue()[0].name;
	
		var windowOptions = {
		 openInNewWindow: true
		};
		
		var parameters = {};
		
		var entityName = "ccx_action";
		
		parameters["ccx_cscaseid"] = CaseID;
		parameters["ccx_cscaseidname"] = CaseName;
		parameters["ccx_category"] = ActionID;
		
		parameters["ccx_csserviceid"] = ServiceID;
		parameters["ccx_csserviceidname"] = ServiceName;		
				
		Xrm.Utility.openEntityForm(entityName, null, parameters, windowOptions);
	}			
}