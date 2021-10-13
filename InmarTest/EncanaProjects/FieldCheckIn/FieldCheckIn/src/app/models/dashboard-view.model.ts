
// Class to represent a field status object.
export class DashBoardView {
  // The area the user is checking in or out of. This can be undefined.
  area: string
  // The application name and version number that created this status object.
  email: string
  // Unique database id of this object.
  id: number;
  // The manager of the individual this status applies to.
  manager: string
  route: string
  // The checkin status. This will either be "IN" or "OUT".
  status: string

  createdAt: Date

  statusDate: Date

  // Version of this object.
  endOfDay: string


  isLate: number



}
