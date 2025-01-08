using BusinessPartner as service from '../../srv/BusinessPartner';
using from '../../db/BusinessPartner';

annotate service.BusinessPartners with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID',
        },
        {
            $Type : 'UI.DataField',
            Value : name,
            Label : 'name',
        },
        {
            $Type : 'UI.DataField',
            Value : division_ID,
            Label : 'division_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : test_ID,
            Label : 'test_ID',
        },
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Details',
            ID : 'Details',
            Target : '@UI.FieldGroup#Details',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Sponsors',
            ID : 'Sponsors',
            Target : 'Sponsors/@UI.LineItem#Sponsors1',
        },
    ],
    UI.FieldGroup #Details : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : ID,
                Label : 'ID',
            },
            {
                $Type : 'UI.DataField',
                Value : name,
                Label : 'name',
            },
            {
                $Type : 'UI.DataField',
                Value : division_ID,
                Label : 'division_division',
            },
            {
                $Type : 'UI.DataField',
                Value : division.name,
                Label : '{i18n>DivisionName}',
            },
            {
                $Type : 'UI.DataField',
                Value : test_ID,
                Label : 'test_ID',
            },
            {
                $Type : 'UI.DataField',
                Value : test.name,
                Label : '{i18n>TestName}',
            },
            {
                $Type : 'UI.DataField',
                Value : type_ID,
                Label : 'type_ID',
            },
            {
                $Type : 'UI.DataField',
                Value : type.value,
                Label : 'Type Name',
            },
        ],
    },
    UI.SelectionFields : [
        division_ID,
    ],
);

annotate service.BusinessPartners with {
    division @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Divisions',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : division_ID,
                    ValueListProperty : 'division',
                },
            ],
        },
        Common.ValueListWithFixedValues : false,
        Common.Text : {
            $value : division.division,
            ![@UI.TextArrangement] : #TextSeparate,
        },
)};

annotate service.BusinessPartners with {
    division_ID @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Divisions',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : division_ID,
                    ValueListProperty : 'division',
                },
            ],
            Label : 'Division Id',
        },
        Common.ValueListWithFixedValues : true,
        Common.Label : 'division_ID',
)};

annotate service.BusinessPartners with {
    test_ID @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Test',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : test_ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'Test Id',
        },
        Common.ValueListWithFixedValues : true,
        )};

annotate service.Test with {
    name @Common.FieldControl : #ReadOnly
};

annotate service.Divisions with {
    name @(
        Common.FieldControl : #ReadOnly,
        Common.Label : 'division/name',
    )
};

annotate service.Divisions with {
    division @Common.Text : name
};

annotate service.BusinessPartners.Sponsor with @(
    UI.LineItem #Sponsors : [
    ],
    UI.LineItem #Sponsors1 : [
        {
            $Type : 'UI.DataField',
            Value : Sponsor_ID,
            Label : 'Sponsor_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : Sponsor.name,
            Label : 'name',
        },
    ],
);

annotate service.Sponsor with {
    name @Common.FieldControl : #ReadOnly
};

annotate service.BusinessPartners.Sponsor with {
    Sponsor_ID @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Sponsor',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : Sponsor_ID,
                    ValueListProperty : 'ID',
                },
            ],
        },
        Common.ValueListWithFixedValues : true
)};

annotate service.BusinessPartners with {
    type_ID @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Type',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : type_ID,
                    ValueListProperty : 'ID',
                },
            ],
        },
        Common.ValueListWithFixedValues : true
)};

annotate service.Type with {
    value @Common.FieldControl : #ReadOnly
};

