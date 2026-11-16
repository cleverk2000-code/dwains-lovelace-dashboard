"use strict";

/** @typedef {{entity_id: string, state: string, attributes: Record<string, any>}} HassEntity */

function averageEntityStates(
  data,
  domain,
  deviceClass,
  /** @type {{isAvailable?: (entity: HassEntity) => boolean}} */
  { isAvailable = () => true } = {},
) {
  const entities = data?.[domain];
  if (!entities) return undefined;

  let unit;
  const values = entities
    .filter((entity) => !deviceClass
      || entity.attributes.device_class === deviceClass)
    .filter((entity) => {
      if (
        !isAvailable(entity)
        || !entity.attributes.unit_of_measurement
        || Number.isNaN(Number(entity.state))
      ) {
        return false;
      }
      if (!unit) {
        unit = entity.attributes.unit_of_measurement;
        return true;
      }
      return entity.attributes.unit_of_measurement === unit;
    });

  if (!values.length) return undefined;
  const sum = values.reduce((total, entity) => total + Number(entity.state), 0);
  return `${Math.round((sum / values.length) * 10) / 10}${unit}`;
}

function countActiveEntities(
  data,
  domain,
  deviceClass,
  { unavailableStates, statesOff },
) {
  const entities = data?.[domain];
  if (!entities) return undefined;
  return entities
    .filter((entity) => !deviceClass
      || entity.attributes.device_class === deviceClass)
    .filter((entity) => !unavailableStates.includes(entity.state)
      && !statesOff.includes(entity.state))
    .length;
}

function localizedClimateState(
  data,
  domain,
  { hass, unavailableStates, statesOff },
) {
  const entities = data?.[domain];
  if (!entities) return undefined;
  const labels = [];

  for (const climate of entities) {
    if (unavailableStates.includes(climate.state)) continue;

    const action = climate.attributes.hvac_action;
    const temperature = climate.attributes.temperature;
    const hasTarget = temperature !== null
      && temperature !== undefined
      && temperature !== ""
      && Number.isFinite(Number(temperature));
    const target = hasTarget
      ? ` (${temperature}${hass.config.unit_system.temperature})`
      : "";

    // Always show the target temperature, even when HVAC is idle or off.
    let status = "";
    if (action && action !== "idle") {
      status = hass.localize(`state_attributes.climate.hvac_action.${action}`) || "";
    } else if (!action && !statesOff.includes(climate.state)) {
      status = hass.localize(`component.climate.state._.${climate.state}`) || "";
    }
    if (status || target) labels.push(status + target);
  }
  return labels.join(", ");
}

function groupEntityStatesByDomain(entityIds, {
  states,
  excludedEntities = {},
  domainGroups,
  deviceClasses,
  sensorDeviceClasses,
}) {
  const entitiesByDomain = {};
  const supportedDomains = new Set(Object.values(domainGroups).flat());

  for (const entityId of entityIds) {
    if (
      excludedEntities[entityId]?.excluded
    ) continue;
    const separator = entityId.indexOf(".");
    if (separator === -1) continue;
    const domain = entityId.slice(0, separator);
    if (!supportedDomains.has(domain)) continue;

    const state = states[entityId];
    if (!state) continue;
    const constrained = domainGroups.sensor.includes(domain)
      || domainGroups.alert.includes(domain)
      || domainGroups.cover.includes(domain);
    const allowedDeviceClasses = domainGroups.sensor.includes(domain)
      ? sensorDeviceClasses
      : deviceClasses[domain];
    if (
      constrained
      && !allowedDeviceClasses.includes(state.attributes.device_class || "")
    ) {
      continue;
    }
    (entitiesByDomain[domain] ||= []).push(state);
  }
  return entitiesByDomain;
}

function isEntityHiddenInArea(entityConfig) {
  return entityConfig?.hidden_in_area === true;
}

module.exports = {
  averageEntityStates,
  countActiveEntities,
  groupEntityStatesByDomain,
  isEntityHiddenInArea,
  localizedClimateState,
};
