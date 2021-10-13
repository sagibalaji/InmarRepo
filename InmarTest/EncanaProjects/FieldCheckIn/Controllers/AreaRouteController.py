from Models import fieldsDbo as md


class AreaBasinController():
    def get(self):
        lstbsinares = md.readBasinAreas()
        resp = [{"area": ob.Area, "basin": ob.Basin} for ob in lstbsinares]
        return resp


class RouteController():
    def get(self, basin, area):
        lstRoutes = md.readRoutesForBasinArea(basin, area)
        print(lstRoutes)
        return lstRoutes