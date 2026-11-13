export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type RelationshipType =
  | "Waalid"
  | "Walal"
  | "Saaxib"
  | "Xiriir"
  | "Macallin"
  | "Jaar";

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          slug: string;
          couple_names: string;
          wedding_date: string | null;
          welcome_note: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          couple_names: string;
          wedding_date?: string | null;
          welcome_note?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          couple_names?: string;
          wedding_date?: string | null;
          welcome_note?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          event_id: string;
          guest_name: string;
          relationship: RelationshipType;
          content: string;
          is_pinned: boolean;
          is_approved: boolean;
          client_fingerprint: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          guest_name: string;
          relationship: RelationshipType;
          content: string;
          is_pinned?: boolean;
          is_approved?: boolean;
          client_fingerprint?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          guest_name?: string;
          relationship?: RelationshipType;
          content?: string;
          is_pinned?: boolean;
          is_approved?: boolean;
          client_fingerprint?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      relationship_type: RelationshipType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
