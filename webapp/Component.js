sap.ui.define(
    ["sap/ui/core/UIComponent"], 
    function(UIComponent) {
        //extend is a keyword indicate inheritence
        return UIComponent.extend("am.hr.payroll.Component", {
            //Section 1: link manifest file to component.js
            metadata: {
                manifest: "json"
            },
            //Section 2: create init function to initialize the component
            init: function() {
                //call the init function of the parent
                UIComponent.prototype.init.apply(this);
                //Get The router objects, here this is the object of Component.js
                var oRouter = this.getRouter();
                //Call initilize method for router obect
                oRouter.initialize();
            },
            //Section 3: create destroy function to destroy the component
            destroy: function() {

            },
            //Section 4: create createContent function to create the content of the component
            // createContent: function() {

            //     var oRootView = new sap.ui.view({
            //         id: "idRootView",
            //         viewName: "am.hr.payroll.view.App",
            //         type: sap.ui.core.mvc.ViewType.XML
            //     });

            //     //Lets create our view1 and view2 objects
            //     var oView1 = new sap.ui.view({
            //         id: "idView1",
            //         viewName: "am.hr.payroll.view.View1",
            //         type: sap.ui.core.mvc.ViewType.XML
            //     });
            //     var oView2 = new sap.ui.view({
            //         id: "idView2",
            //         viewName: "am.hr.payroll.view.View2",
            //         type: sap.ui.core.mvc.ViewType.XML
            //     });
            //     var oEmpty = new sap.ui.view({
            //         id: "idEmpty",
            //         viewName: "am.hr.payroll.view.Empty",
            //         type: sap.ui.core.mvc.ViewType.XML
            //     });

            //     //Obtain our App Container control object from the root view
            //     var oAppCon = oRootView.byId("appCon");

            //     //Add the view1 and view2 to the app container (pages aggregation of App Container)
            //     //https://ui5.sap.com/#/api/sap.m.App%23aggregations
            //     oAppCon.addMasterPage(oView1);
            //     oAppCon.addDetailPage(oEmpty).addDetailPage(oView2);

            //     return oRootView;

            // }
        });
    }
);