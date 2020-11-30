# Icinga2API

NodeJS library for accessing the Icinga2 API

[Icinga2 API Documentation](https://icinga.com/docs/icinga2/latest/doc/12-icinga2-api)

## Getting started

### Initialize Icinga2API class

Returns a promise that resolves upon successful connection to the API.

```js
(async () => {
  try {
    const icinga2 = await new Icinga2API(
      "username", // REQUIRED
      "password", // REQUIRED
      "host", // OPTIONAL - Defaults to localhost
      "port" // OPTIONAL - Defaults to 5665
    );
  } catch(e) {
    //Handle errors
  }
})();
```

## Methods

### Hosts

##### [host().all()](https://icinga.com/docs/icinga2/latest/doc/09-object-types/#host)

```js
const hosts = await icinga2.host().all();
```

Returns a promise that resolves with all hosts currently configured.

##### [host().groups()](https://icinga.com/docs/icinga2/latest/doc/09-object-types/#hostgroup)

```js
const hostGroups = await icinga2.host().groups();
```

Returns a promise that resolves with all host groups currently configured.

### Events

##### [events(queue: string, types: array)](https://icinga.com/docs/icinga2/latest/doc/12-icinga2-api/#icinga2-api-event-streams)

Returns an observable that fires on every new event. Please refer to the Icinga2 documentation for information on queue and types values.

```js
icinga2.events("queueName", ["StateChange", "AcknowledgementSet"]).subscribe(
  (event) => {
    console.log(event);
  }
);
```
