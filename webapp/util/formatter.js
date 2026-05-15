sap.ui.define([], function(){
    return {
        getStatusText: function(sStatus){
            switch (sStatus) {
                case "A":
                    return "Available"
                case "D":
                    return "Discontinued"
                case "O":
                    return "Out of Stock"
                case "P":
                    return "Paid"
                default:
                    return "Unknown"
            }
        },
        getStatusState: function(sStatus){
            switch (sStatus) {
                case "A":
                    return "Success"
                case "D":
                    return "Error"
                case "O":
                    return "Warning"
                case "P":
                    return "Success"
                default:
                    return "Warning"
            }
        }
    }
});