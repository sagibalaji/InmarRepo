
// Class to represent a field status object.
export class FieldStatus {
    // The area the user is checking in or out of. This can be undefined.
    area: string = ""
    // The application name and version number that created this status object.
    appNameVersion: string = ""
    // A comment regarding this status. Typically undefined.
    comment: string = ""
    // The individual who last changed this entry.
    changedBy: string = ""
    // The date this object was created in the database.
    createdAt: Date
    // Was this item deleted from the database.
    deleted: boolean = false;
    // Email address of the individual this field status applies to.
    email: string
    // Unique database id of this object.
    id: string
    // The manager of the individual this status applies to.
    manager: string
    // The phone number of the individual this field status refers to.
    phoneNumber: string
    // The route the user is checking in or out of. This can be undefined.
    route: string
    // The checkin status. This will either be "IN" or "OUT".
    status: string
    // The time and date this status refers to.
    statusDate: Date
    // The date this object was updated in the database.
    updatedAt: Date
    // Version of this object.
    version: number[]
  }
  