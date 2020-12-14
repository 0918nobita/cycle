import { Driver, run } from '@cycle/run';
import xs, { Listener, Producer, Stream } from 'xstream';

type Named<Name extends string, Effect> = { [_ in Name]: Effect };

type Eff = 'dateTime';

type AnonSi = Stream<unknown>;
type AnonSo = Stream<Date>;

type NamedSi = Named<Eff, AnonSi>;
type NamedSo = Named<Eff, AnonSo>;

function main({ dateTime }: NamedSo): NamedSi {
  dateTime.addListener({
    next(v) {
      console.log({ v });
    },
  });

  const producer: Producer<unknown> & { id: number } = {
    id: 0,
    start(listener: Listener<unknown>) {
      this.id = setInterval(() => listener.next(null), 1000);
    },
    stop() {
      clearInterval(this.id);
    },
  };

  return {
    dateTime: xs.create(producer),
  };
}

function makeDateTimeDriver(): Driver<AnonSi, AnonSo> {
  return function dateTimeDriver($: AnonSi): AnonSo {
    return $.map((_) => new Date());
  };
}

run(main, {
  dateTime: makeDateTimeDriver(),
});
