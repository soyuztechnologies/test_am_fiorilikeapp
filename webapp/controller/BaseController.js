sap.ui.define(
    ["sap/ui/core/mvc/Controller",
     "am/hr/payroll/util/formatter",
     "sap/ui/core/routing/History"
    ],
    function(Controller, lifeSaver, History){
        return Controller.extend("am.hr.payroll.controller.BaseController", {
            formatter: lifeSaver,
            //Step 1: Define the global variables to hold the memory path
            memoryPathSel:"",
            giveNavigation: function(){
                //this -- this is the current controller
                //getOwnerComponent -- object of Component.js
                return this.getOwnerComponent().getRouter()
            },
            back: function(){
                const oHistory = History.getInstance();
                const sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    const oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("spiderman", {}, true);
                }
            }
        });
    }
);