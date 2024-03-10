import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MyProjectName } from "../target/types/my_project_name";

describe("my_project_name", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.MyProjectName as Program<MyProjectName>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
  it("My wallet!", async () => {
    // Add your test here.
    const tx = await program.methods.processInstruction(new anchor.BN(1)).rpc();
    console.log("Your transaction signature", tx);
  });

});
