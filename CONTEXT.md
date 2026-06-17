# LRT Mobile

The LRT.lt React Native app for Lithuanian public broadcasting. This glossary captures domain terms whose meaning is easy to confuse, so code and conversation use one agreed word per concept.

## Language

### Mediateka

**Show**:
A recurring video programme such as Panorama or Virtuvėje su Beata. A show owns many episodes over time and is represented in the feed as a category.
_Avoid_: Category (overloaded — see below), programme, laida in code identifiers

**Episode**:
A single dated video record of a Show (one broadcast/recording). The newest episode of a Show is its "latest item".
_Avoid_: Article, record, item, įrašas in code identifiers

**Show Collection**:
A curated, horizontally scrolling row of Shows (not episodes), each shown as a vertical poster. Tapping a poster opens that Show's latest Episode. Distinct from an episode row, which lists Episodes directly.
_Avoid_: Category collection, laidų kolekcija in code identifiers

**Category**:
An ambiguous source term: the backend calls both a Show and an episode grouping a "category". Prefer Show when the thing has episodes beneath it; reserve Category only for an episode-listing block.
_Avoid_: Using "category" for a Show
