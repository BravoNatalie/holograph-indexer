import assert from "assert";
import { 
  TestHelpers,
  EventsSummaryEntity,
  HolographRegistry_HolographableContractEventEntity
} from "generated";
const { MockDb, HolographRegistry, Addresses } = TestHelpers;

import { GLOBAL_EVENTS_SUMMARY_KEY } from "../src/EventHandlers";


const MOCK_EVENTS_SUMMARY_ENTITY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  holographRegistry_HolographableContractEventCount: BigInt(0),
};

describe("HolographRegistry contract HolographableContractEvent event tests", () => {
  // Create mock db
  const mockDbInitial = MockDb.createMockDb();

  // Add mock EventsSummaryEntity to mock db
  const mockDbFinal = mockDbInitial.entities.EventsSummary.set(
    MOCK_EVENTS_SUMMARY_ENTITY
  );

  // Creating mock HolographRegistry contract HolographableContractEvent event
  const mockHolographRegistryHolographableContractEventEvent = HolographRegistry.HolographableContractEvent.createMockEvent({
    _holographableContract: Addresses.defaultAddress,
    _payload: "foo",
    mockEventData: {
      chainId: 1,
      blockNumber: 0,
      blockTimestamp: 0,
      blockHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      srcAddress: Addresses.defaultAddress,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      transactionIndex: 0,
      logIndex: 0,
    },
  });

  // Processing the event
  const mockDbUpdated = HolographRegistry.HolographableContractEvent.processEvent({
    event: mockHolographRegistryHolographableContractEventEvent,
    mockDb: mockDbFinal,
  });

  it("HolographRegistry_HolographableContractEventEntity is created correctly", () => {
    // Getting the actual entity from the mock database
    let actualHolographRegistryHolographableContractEventEntity = mockDbUpdated.entities.HolographRegistry_HolographableContractEvent.get(
      mockHolographRegistryHolographableContractEventEvent.transactionHash +
        mockHolographRegistryHolographableContractEventEvent.logIndex.toString()
    );

    // Creating the expected entity
    const expectedHolographRegistryHolographableContractEventEntity: HolographRegistry_HolographableContractEventEntity = {
      id:
        mockHolographRegistryHolographableContractEventEvent.transactionHash +
        mockHolographRegistryHolographableContractEventEvent.logIndex.toString(),
      _holographableContract: mockHolographRegistryHolographableContractEventEvent.params._holographableContract,
      _payload: mockHolographRegistryHolographableContractEventEvent.params._payload,
      eventsSummary: "GlobalEventsSummary",
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualHolographRegistryHolographableContractEventEntity, expectedHolographRegistryHolographableContractEventEntity, "Actual HolographRegistryHolographableContractEventEntity should be the same as the expectedHolographRegistryHolographableContractEventEntity");
  });

  it("EventsSummaryEntity is updated correctly", () => {
    // Getting the actual entity from the mock database
    let actualEventsSummaryEntity = mockDbUpdated.entities.EventsSummary.get(
      GLOBAL_EVENTS_SUMMARY_KEY
    );

    // Creating the expected entity
    const expectedEventsSummaryEntity: EventsSummaryEntity = {
      ...MOCK_EVENTS_SUMMARY_ENTITY,
      holographRegistry_HolographableContractEventCount: MOCK_EVENTS_SUMMARY_ENTITY.holographRegistry_HolographableContractEventCount + BigInt(1),
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualEventsSummaryEntity, expectedEventsSummaryEntity, "Actual HolographRegistryHolographableContractEventEntity should be the same as the expectedHolographRegistryHolographableContractEventEntity");
  });
});
