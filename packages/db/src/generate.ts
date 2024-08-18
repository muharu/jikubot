export class SnowflakeIdGenerator {
  private static EPOCH = 1609459200000; // January 1, 2021 (Custom epoch)
  private static MACHINE_ID_BITS = 10; // Number of bits allocated to the machine ID
  private static SEQUENCE_BITS = 12; // Number of bits allocated to the sequence number
  private static MAX_MACHINE_ID =
    (1 << SnowflakeIdGenerator.MACHINE_ID_BITS) - 1;
  private static MAX_SEQUENCE = (1 << SnowflakeIdGenerator.SEQUENCE_BITS) - 1;

  private machineId: number;
  private sequence: number;
  private lastTimestamp: number;

  constructor(machineId: number) {
    if (machineId < 0 || machineId > SnowflakeIdGenerator.MAX_MACHINE_ID) {
      throw new Error(
        `Machine ID must be between 0 and ${SnowflakeIdGenerator.MAX_MACHINE_ID}`,
      );
    }
    this.machineId = machineId;
    this.sequence = 0;
    this.lastTimestamp = -1;
  }

  generateId(): string {
    let timestamp = Date.now();

    if (timestamp < this.lastTimestamp) {
      throw new Error(
        "Clock moved backwards. Refusing to generate ID for " +
          (this.lastTimestamp - timestamp) +
          " milliseconds",
      );
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & SnowflakeIdGenerator.MAX_SEQUENCE;
      if (this.sequence === 0) {
        while (timestamp <= this.lastTimestamp) {
          timestamp = Date.now();
        }
      }
    } else {
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    // Convert values to bigint for bitwise operations
    const timestampBigInt = BigInt(timestamp - SnowflakeIdGenerator.EPOCH);
    const shiftAmount = BigInt(
      SnowflakeIdGenerator.MACHINE_ID_BITS + SnowflakeIdGenerator.SEQUENCE_BITS,
    );
    const timestampPart = timestampBigInt << shiftAmount;

    const machineIdPart =
      BigInt(this.machineId) << BigInt(SnowflakeIdGenerator.SEQUENCE_BITS);
    const sequencePart = BigInt(this.sequence);

    const id = timestampPart | machineIdPart | sequencePart;

    return id.toString();
  }

  parseId(id: string): {
    timestamp: number;
    machineId: number;
    sequence: number;
  } {
    const idBigInt = BigInt(id);

    const shiftAmount = BigInt(
      SnowflakeIdGenerator.MACHINE_ID_BITS + SnowflakeIdGenerator.SEQUENCE_BITS,
    );
    const timestampPart =
      (idBigInt >> shiftAmount) + BigInt(SnowflakeIdGenerator.EPOCH);
    const machineIdPart =
      (idBigInt >> BigInt(SnowflakeIdGenerator.SEQUENCE_BITS)) &
      BigInt(SnowflakeIdGenerator.MAX_MACHINE_ID);
    const sequencePart = idBigInt & BigInt(SnowflakeIdGenerator.MAX_SEQUENCE);

    return {
      timestamp: Number(timestampPart),
      machineId: Number(machineIdPart),
      sequence: Number(sequencePart),
    };
  }
}

export const snowflake = new SnowflakeIdGenerator(1);
