import * as events from 'events';

class DataTable extends events.EventEmitter {
    index = 0;
    table = [];

    getNewId() {
        return this.index++;
    }

    getTable() {
        return this.table;
    }

    insert(data, pos = this.table.length) {
        const insertedData = data.map(text => ({id: this.getNewId(), text})) ;
        this.table.splice( pos, 0, ...insertedData);
        this.emit('insert', {rows: insertedData, pos});
    }

    delete(indexes) {
        this.table = this.table.filter(row => !indexes.includes(row.id));
        this.emit('delete', indexes);
    }

    update(rows) {
        const updatedData = [];
        rows.forEach(({id, text}) => {
            const index = this.table.findIndex((row) => row.id === id);
            if (index !== -1) {
                this.table[index].text = text;
                updatedData.push(this.table[index]);
            }
        });
        this.emit('update', updatedData);
    }

    move(shifts) {
        shifts.forEach((shift) => {
            this.table.splice(shift.to, 0, this.table.splice(shift.from, 1)[0]);
        });
        this.emit('move', shifts);
    }
}

export {DataTable};
