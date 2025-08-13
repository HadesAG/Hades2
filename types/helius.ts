export interface HeliusAsset {
  interface: string
  id: string
  content: {
    $schema?: string
    json_uri?: string
    files?: Array<{
      uri: string
      cdn_uri?: string
      mime?: string
      type?: string
    }>
    metadata: {
      attributes?: Array<{
        trait_type: string
        value: string
      }>
      description?: string
      name?: string
      symbol?: string
      image?: string
    }
    links?: {
      image?: string
    }
  }
  authorities?: Array<{
    address: string
    scopes: string[]
  }>
  compression?: {
    eligible: boolean
    compressed: boolean
    data_hash?: string
    creator_hash?: string
    asset_hash?: string
    tree?: string
    seq?: number
    leaf_id?: number
  }
  grouping?: Array<{
    group_key: string
    group_value: string
  }>
  royalty?: {
    royalty_model: string
    target?: string
    percent?: number
    basis_points?: number
    primary_sale_happened: boolean
    locked: boolean
  }
  creators?: Array<{
    address: string
    share: number
    verified: boolean
  }>
  ownership: {
    frozen: boolean
    delegated: boolean
    delegate?: string
    ownership_model: string
    owner: string
  }
  supply?: {
    print_max_supply?: number
    print_current_supply?: number
    edition_nonce?: number
  }
  mutable: boolean
  burnt: boolean
  token_info?: {
    symbol: string
    balance: number
    decimals: number
    token_program: string
    associated_token_address: string
    price_info?: {
      price_per_token: number
      total_price: number
      currency: string
    }
  }
  collection?: {
    verified: boolean
    key: string
    address: string
  }
  collection_metadata?: {
    name?: string
    symbol?: string
    image?: string
    description?: string
    external_url?: string
  }
}

export interface HeliusResponse {
  items: HeliusAsset[]
}
