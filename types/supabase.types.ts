export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      tbl_document_versions: {
        Row: {
          created_at: string | null
          document_id: string
          document_version: number
          is_enabled: boolean
          page_count: number | null
        }
        Insert: {
          created_at?: string | null
          document_id: string
          document_version?: number
          is_enabled?: boolean
          page_count?: number | null
        }
        Update: {
          created_at?: string | null
          document_id?: string
          document_version?: number
          is_enabled?: boolean
          page_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_document_versions_document_id_fkey"
            columns: ["document_id"]
            referencedRelation: "tbl_documents"
            referencedColumns: ["document_id"]
          }
        ]
      }
      tbl_documents: {
        Row: {
          created_at: string
          created_by: string | null
          document_id: string
          document_name: string
          document_seq: number
          image: string | null
          is_enabled: boolean
          org_id: string | null
          source_path: string
          source_type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          document_id?: string
          document_name: string
          document_seq?: number
          image?: string | null
          is_enabled?: boolean
          org_id?: string | null
          source_path: string
          source_type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          document_id?: string
          document_name?: string
          document_seq?: number
          image?: string | null
          is_enabled?: boolean
          org_id?: string | null
          source_path?: string
          source_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "tbl_documents_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_documents_org_id_fkey"
            columns: ["org_id"]
            referencedRelation: "tbl_org"
            referencedColumns: ["org_id"]
          }
        ]
      }
      tbl_links: {
        Row: {
          created_at: string | null
          created_by: string | null
          document_id: string
          is_active: boolean
          is_domain_restricted: boolean
          is_download_allowed: boolean
          is_email_required: boolean
          is_expiration_enabled: boolean
          is_password_required: boolean
          is_verification_required: boolean
          is_watermarked: boolean
          link_id: string | null
          link_name: string
          link_password: string | null
          link_seq: number
          restricted_domains: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          document_id: string
          is_active?: boolean
          is_domain_restricted?: boolean
          is_download_allowed?: boolean
          is_email_required?: boolean
          is_expiration_enabled?: boolean
          is_password_required?: boolean
          is_verification_required?: boolean
          is_watermarked?: boolean
          link_id?: string | null
          link_name: string
          link_password?: string | null
          link_seq?: number
          restricted_domains?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          document_id?: string
          is_active?: boolean
          is_domain_restricted?: boolean
          is_download_allowed?: boolean
          is_email_required?: boolean
          is_expiration_enabled?: boolean
          is_password_required?: boolean
          is_verification_required?: boolean
          is_watermarked?: boolean
          link_id?: string | null
          link_name?: string
          link_password?: string | null
          link_seq?: number
          restricted_domains?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_links_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_links_document_id_fkey"
            columns: ["document_id"]
            referencedRelation: "tbl_documents"
            referencedColumns: ["document_id"]
          }
        ]
      }
      tbl_org: {
        Row: {
          org_id: string
          org_name: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          org_id?: string
          org_name?: string | null
          role: string
          user_id?: string | null
        }
        Update: {
          org_id?: string
          org_name?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_org_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tbl_view_logs: {
        Row: {
          page_num: number
          view_end_at: string | null
          view_id: string | null
          view_log_seq: number
          view_start_at: string | null
        }
        Insert: {
          page_num?: number
          view_end_at?: string | null
          view_id?: string | null
          view_log_seq?: number
          view_start_at?: string | null
        }
        Update: {
          page_num?: number
          view_end_at?: string | null
          view_id?: string | null
          view_log_seq?: number
          view_start_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_view_logs_view_id_fkey"
            columns: ["view_id"]
            referencedRelation: "tbl_views"
            referencedColumns: ["view_id"]
          }
        ]
      }
      tbl_views: {
        Row: {
          document_version: number | null
          link_id: string
          view_id: string
          view_seq: number
          viewed_at: string | null
          viewer: string
        }
        Insert: {
          document_version?: number | null
          link_id: string
          view_id: string
          view_seq?: number
          viewed_at?: string | null
          viewer?: string
        }
        Update: {
          document_version?: number | null
          link_id?: string
          view_id?: string
          view_seq?: number
          viewed_at?: string | null
          viewer?: string
        }
        Relationships: [
          {
            foreignKeyName: "tbl_views_link_id_fkey"
            columns: ["link_id"]
            referencedRelation: "tbl_links"
            referencedColumns: ["link_id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authorize_viewer: {
        Args: {
          link_id_input: string
          email_input?: string
        }
        Returns: Json
      }
      gen_document_id: {
        Args: {
          size?: number
          alphabet?: string
        }
        Returns: string
      }
      gen_links_id: {
        Args: {
          alphabet?: string
        }
        Returns: string
      }
      gen_view_id: {
        Args: {
          link_id_input: string
        }
        Returns: string
      }
      get_document_id: {
        Args: {
          document_id_input?: string
        }
        Returns: Json
      }
      get_link_props: {
        Args: {
          link_id_input: string
        }
        Returns: Json
      }
      list_org_from_user: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

