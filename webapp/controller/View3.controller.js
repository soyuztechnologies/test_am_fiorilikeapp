sap.ui.define(
    ["am/hr/payroll/controller/BaseController"],
    function(BaseController) {
        return BaseController.extend("am.hr.payroll.controller.View3", {

            onInit: function(){

                var oRouter = this.giveNavigation();
                //attach a new RMH method and pass our controller object to the method
                oRouter.getRoute("baloo").attachMatched(this.herculis, this);

            },
            herculis: function(oEvent){
                //extract the path variable from route end point
                var sIndex = oEvent.getParameter("arguments").suppId;
                //rebuild the element path - which was selected by user
                var sPath = '/supplier/' + sIndex;
                //Bind the element with the view
                this.getView().bindElement(sPath);
            },
            onBack: function(){
                this.back();
            }
        });
    }
);