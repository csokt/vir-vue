# vir-vue
VIR vue frontend

# component dependencies

/base
ApiGet
BaseCard
BaseList
BaseMenu
BaseTime
BaseQreader
BaseQfield            ( BaseQreader )
SmartInform
SmartAutocomplete     ( ApiGet )
SmartList             ( ApiGet, BaseList )
SmartLookup           ( ApiGet, BaseQfield )

/chance
BaseCikkInfo
KeszletTable          ( ApiGet )
ListCikkKeszlet       ( SmartList )

/legrand
BaseCikkInfo
ListCikkKeszlet       ( SmartList )
MuveletvegzesTable    ( ApiGet )

/targyi-eszkoz
BaseEszkozInfo
BaseKorzetInfo
BaseMozgasInfo
Eszkozhasznalo
EszkozMozgas
KorzetEszkozok        ( ApiGet )
LeltarivEszkozok      ( ApiGet )
LookupEszkoz          ( SmartLookup )


# view component dependencies
/
Home                  ( BaseCard, BaseMenu )
VirMenu               ( BaseCard, BaseMenu )

/chance
Info                  ( BaseCard, BaseCikkInfo, SmartAutocomplete, SmartLookup, ListCikkKeszlet )
Keszlet               ( BaseCard, SmartAutocomplete, SmartLookup, KeszletTable )

/legrand
Info                  ( BaseCard, BaseCikkInfo, SmartAutocomplete, ListCikkKeszlet )
Muveletvegzes         ( BaseCard, SmartAutocomplete, MuveletvegzesTable )

/targyi-eszkoz
Athelyezes            ( BaseCard, BaseEszkozInfo, SmartAutocomplete, LookupEszkoz, EszkozMozgas )
Erkeztetes            ( BaseCard, BaseMozgasInfo, EszkozMozgas )
Info                  ( BaseCard, BaseEszkozInfo, LookupEszkoz, EszkozMozgas )
LeltarEszkozadat      ( BaseCard, LookupEszkoz, LeltarivEszkozok )
LeltarFelvetel        ( BaseCard, BaseEszkozInfo, LookupEszkoz, LeltarivEszkozok )
LeltarIsmeretlen      ( BaseCard, SmartList )
Leltarkorzet          ( BaseCard, BaseKorzetInfo, SmartAutocomplete, KorzetEszkozok )
LeltarLeltarivEszkoz  ( BaseCard, LeltarivEszkozok )
Leltar                ( BaseCard, BaseMenu, SmartAutocomplete )
Szemelynek            ( BaseCard, BaseEszkozInfo, SmartAutocomplete, LookupEszkoz, Eszkozhasznalo )
