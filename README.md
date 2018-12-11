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
KeszletTable
ListCikkKeszlet       ( SmartList )

/legrand
BaseCikkInfo
ListCikkKeszlet       ( SmartList )
MuveletvegzesTable

/targyi-eszkoz
BaseEszkozInfo
BaseKorzetInfo
BaseMozgasInfo
Eszkozhasznalo
EszkozMozgas
KorzetEszkozok
LeltarivEszkozok
LeltarivIsmeretlen
LookupEszkoz          ( SmartLookup )


# view component dependencies
/
Home                  ( BaseCard, BaseMenu )
VirMenu               ( BaseCard, BaseMenu )

/chance
Info                  ( BaseCard, BaseCikkInfo, SmartAutocomplete, LookupCikkByVonalkod, ListCikkKeszlet )
Keszlet               ( BaseCard, SmartAutocomplete, KeszletTable )

/legrand
Info                  ( BaseCard, BaseCikkInfo, SmartAutocomplete, ListCikkKeszlet )
Muveletvegzes         ( BaseCard, SmartAutocomplete, MuveletvegzesTable )

/targyi-eszkoz
Athelyezes            ( BaseCard, BaseEszkozInfo, SmartAutocomplete, LookupEszkoz, EszkozMozgas )
Erkeztetes            ( BaseCard, BaseMozgasInfo, EszkozMozgas )
Info                  ( BaseCard, BaseEszkozInfo, LookupEszkoz, EszkozMozgas )
LeltarEszkozadat      ( BaseCard, LookupEszkoz, LeltarivEszkozok )
LeltarFelvetel        ( BaseCard, BaseEszkozInfo, LookupEszkoz, LeltarivEszkozok )
LeltarIsmeretlen      ( BaseCard, LeltarivIsmeretlen )
Leltarkorzet          ( BaseCard, BaseKorzetInfo, SmartAutocomplete, KorzetEszkozok )
LeltarLeltarivEszkoz  ( BaseCard, LeltarivEszkozok )
Leltar                ( BaseCard, BaseMenu, BaseKorzetInfo, SmartAutocomplete, KorzetEszkozok )
Szemelynek            ( BaseCard, BaseEszkozInfo, SmartAutocomplete, LookupEszkoz, Eszkozhasznalo )
