// Class to represent a basin and area object.
// This will ultimately be used to map to the "area" property of the field status.
export class BasinArea {
    // An area that exists within the basin.
    area: string = ""
    // The basin that contains the area.
    basin: string = ""
  
    // Given a json object convert it into a BasinArea object.
    static jsonToBasinArea(json: any): BasinArea | undefined {
      if (!json) {
        return undefined
      }
      
      let result = new BasinArea()
      result.area = json.area
      result.basin = json.basin
  
      return (result.area && result.basin) ? result : undefined
    }
  
  }
  