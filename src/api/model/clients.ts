export class Client {
    public fullName: string = '';

    constructor(
        //Think about ID and AVATAR
        public id: string | number,
        public firstName: string,
        public lastName: string,

        //Note: primary email goes first
        // public emails: string[],
        public email: string,
        //Note: primary phone goes first
        // public phones: string[],
        public phone: string,
        public createdAt: Date,
        public updatedAt: Date,
        public international?: boolean,

        public utm_source?: string,
        public utm_medium?: string,
        public utm_content?: string,
        public utm_campaign?: string,
        public utm_term?: string,
    ) {
        this.fullName = `${firstName} ${lastName}`;
    }
}

export enum ClientDataIndex {
    ID = 'id',
    FirstName = 'firstName',
    LastName = 'lastName',
    FullName = 'fullName',
    Email = 'email',
    Phone = 'phone',
    CreatedAt = 'createdAt',
    UpdatedAt = 'updatedAt',
    utm_source = 'utm_source',
    utm_medium = 'utm_medium',
    utm_content = 'utm_content',
    utm_campaign = 'utm_campaign',
    utm_term = 'utm_term'
}

export interface IClientFields {
    [ClientDataIndex.ID]: number | string,
    [ClientDataIndex.FirstName]: string,
    [ClientDataIndex.LastName]: string,
    [ClientDataIndex.FullName]: string,
    [ClientDataIndex.Email]: string,
    [ClientDataIndex.Phone]: string,
    [ClientDataIndex.CreatedAt]: Date,
    [ClientDataIndex.UpdatedAt]: Date,
    [ClientDataIndex.utm_source]?: string,
    [ClientDataIndex.utm_medium]?: string,
    [ClientDataIndex.utm_content]?: string,
    [ClientDataIndex.utm_campaign]?: string,
    [ClientDataIndex.utm_term]?: string,
}

export interface IGetClientsResponse {
    rows: Client[];
    total: number;
}

export const blankClient = new Client(
    '',
    '',
    '',
    '',
    '',
    new Date(),
    new Date(),
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
);
