### CSS

jsplumb-group-expanded             added to non-collapsed group elements (added when group initialised)
jsplumb-group-collapsed            added to collapsed group elements

jsplumb-group-content              placeholder class for users to indicate what the draggable area is inside a group
                                   node. This name may change, as it may be the case that this concept is more generic than
                                   just a groups concept.
                                   

---

### BEHAVIOUR

- proxies when collapsed (by default; optionally can be switched off)
- be careful to ensure you add any elements from the child nodes on which you wish to click etc as selectors to
a groups `dragOptions:{ filter: ....}`

---

### API

addGroup(group)

removeGroup(group, deleteMembers)

addToGroup(group, el)

removeFromGroup

collapseGroup

expandGroup

---

### DRAG/DROP

outside drop modes: revert, ignore, prune, orphan, ghost

drag/drop between groups.



