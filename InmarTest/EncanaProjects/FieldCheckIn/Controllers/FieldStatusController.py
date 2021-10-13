from Models import fieldsDbo

class FieldStatusController():
    def get(self, email):
        # email = request.form["email"]
        print("email: " + email)
        fieldStatus = fieldsDbo.getStatusField(email)
        jsonVar = None
        if fieldStatus is not None:
            jsonVar = {
                "id": fieldStatus.id,
                "createdAt": fieldStatus.CreatedAt,
                "updatedAt": fieldStatus.UpdatedAt,
                "version": str(fieldStatus.Version),
                "deleted": fieldStatus.Deleted,
                "email": fieldStatus.Email,
                "status": fieldStatus.Status,
                "area": fieldStatus.Area,
                "route": fieldStatus.route,
                "comment": fieldStatus.Comment,
                "phoneNumber": fieldStatus.PhoneNumber,
                "manager": fieldStatus.Manager,
                "changedBy": fieldStatus.ChangedBy
            }
        print(jsonVar)
        return jsonVar
    
    def post(self, fieldStatus):
        validationError = _validateFieldStatusAdd(fieldStatus)
        print("Validation completed")
        if validationError is None:
            # return badrequest message
            return {"BadRequest": "Validation faild"}
        
        # code for saving fieldStatus data start
        try:
            fieldsDbo.saveFieldStatus(fieldStatus)
        except Exception as ex:
            raise ex
        # code for saving fieldStatus data end

        return {"Success": fieldStatus}


def _validateFieldStatusAdd(fieldStatus):
        error = None
        if fieldStatus.get("email") == None and fieldStatus.get("email").strip() == "":
            error = "Email is not defined"
        elif fieldStatus.get("status") == None and fieldStatus.get("status").strip() == "":
            error = "Checkin status is not defined"
        elif fieldStatus.get("status") not in ["IN" , "Out"]:
            error = "Checkin status must be \"IN\" or \"OUT\"; value is \"{0}".format(str(fieldStatus.get("status")))
        elif fieldStatus.get("id") is not None or not fieldStatus.get("id"):
            error = "Database Id must be undefined"
        
        return error