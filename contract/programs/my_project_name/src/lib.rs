use anchor_lang::prelude::*;
use serde::{Serialize, Deserialize};

// Define a struct for the ranges, for simplicity.
struct Range {
    amount_from: u64,
    amount_to: u64,
    address: Pubkey,
}

#[derive(Debug, Serialize, Deserialize)]
struct Segment {
    indicator_from: u64,
    indicator_to: u64,
    address: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Product {
    product_id: u64,
    segments: Vec<Segment>,
}

type Products = Vec<Product>;

declare_id!("2X7YkxcdDdZ2dHwie2c6euXi8fhrY7H5PkyFpiyg9JiX");

#[program]
pub mod my_project_name {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn process_instruction(
        ctx: Context<Initialize>,
        balance:  u64
    ) -> Result<(Vec<String>)> {
        
        let products: Products = vec![
            Product {
                product_id: 1,
                segments: vec![
                    Segment { indicator_from: 0, indicator_to: 358, address: String::from("Mad Lads") }
                ],
            },
            Product {
                product_id: 2,
                segments: vec![
                    Segment { indicator_from: 6000, indicator_to: 7000, address: String::from("Famous Fox Federation") }
                ],
            },
            Product {
                product_id: 3,
                segments: vec![
                    Segment { indicator_from: 405, indicator_to: 2480, address: String::from("Frogana name") }
                ],
            }
        ];

        // create a array to store the segment address that will be returned
        let mut segment_address: Vec<String> = Vec::new();

        for product in products {
            for segment in &product.segments {
                if balance >= segment.indicator_from && balance <= segment.indicator_to {
                    // Return the address if the indicator falls within the segment range
                    // Logic here to return the address or handle it as needed.
                    msg!("The recommended product for this wallet is the item associated with {:?}", segment.address);

                    segment_address.push(segment.address.clone());
                }
            }
        }

        Ok(segment_address)
    }
}

#[derive(Accounts)]
pub struct Initialize { }