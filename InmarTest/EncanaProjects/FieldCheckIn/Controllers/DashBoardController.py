from Models import fieldsDbo as md

class DashBoardController:
    def GetStatusForDate(self, statusDate, userName):
        lstbsinares = md.getStatusEmployees(statusDate, userName)
        resp = [{"id": ob.id, "email": ob.email, "manager": ob.manager, "status": ob.status, "statusDate": ob.statusDate, 
                "createdAt": ob.createdAt, "EndOfDay": ob.EndOfDay, "isLate": ob.isLate, "area": ob.area, "route": ob.route} 
                for ob in lstbsinares]
        return resp