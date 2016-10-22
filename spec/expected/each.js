for (var i1 in data.people) {
IncrementalDOM.text(data.people[i1].age);
IncrementalDOM.text('\n');
for (var i3 in data.people[i1].names) {
IncrementalDOM.text(data.people[i1].names[i3]);
IncrementalDOM.text('\n');
}
}
IncrementalDOM.text('\n');
for (var i1 in data.goodbyes) {
IncrementalDOM.text(i1);
IncrementalDOM.text('. ');
IncrementalDOM.text(data.goodbyes[i1].text);
IncrementalDOM.text('!\n');
}
IncrementalDOM.text('cruel ');
IncrementalDOM.text(data.world);
IncrementalDOM.text('!\n\n');
for (var i1 in data.goodbyes) {
IncrementalDOM.text(i1);
IncrementalDOM.text('. ');
IncrementalDOM.text(data.goodbyes[i1].text);
IncrementalDOM.text('!\n');
}
IncrementalDOM.text('cruel ');
IncrementalDOM.text(data.world);
IncrementalDOM.text('!\n');
