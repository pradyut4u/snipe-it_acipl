--
-- PostgreSQL database dump
--

\restrict Gs9WL00SSOfUUtgkfuUEsW31bCZQ974fMCiRUwbxsS2d65GOj8ZGMsdGwwn0CoQ

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."Asset_assetTag_key";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."License" DROP CONSTRAINT IF EXISTS "License_pkey";
ALTER TABLE IF EXISTS ONLY public."EventItem" DROP CONSTRAINT IF EXISTS "EventItem_pkey";
ALTER TABLE IF EXISTS ONLY public."Consumable" DROP CONSTRAINT IF EXISTS "Consumable_pkey";
ALTER TABLE IF EXISTS ONLY public."Asset" DROP CONSTRAINT IF EXISTS "Asset_pkey";
ALTER TABLE IF EXISTS ONLY public."ActivityLog" DROP CONSTRAINT IF EXISTS "ActivityLog_pkey";
ALTER TABLE IF EXISTS ONLY public."Accessory" DROP CONSTRAINT IF EXISTS "Accessory_pkey";
ALTER TABLE IF EXISTS public."Asset" ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."License";
DROP TABLE IF EXISTS public."EventItem";
DROP TABLE IF EXISTS public."Consumable";
DROP SEQUENCE IF EXISTS public."Asset_id_seq";
DROP TABLE IF EXISTS public."Asset";
DROP TABLE IF EXISTS public."ActivityLog";
DROP TABLE IF EXISTS public."Accessory";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: snipeit
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO snipeit;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: snipeit
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Accessory; Type: TABLE; Schema: public; Owner: snipeit
--

CREATE TABLE public."Accessory" (
    id text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    "modelNumber" text NOT NULL,
    "totalQuantity" integer NOT NULL,
    "remainingQuantity" integer NOT NULL,
    "minQuantity" integer NOT NULL,
    location text NOT NULL
);


ALTER TABLE public."Accessory" OWNER TO snipeit;

--
-- Name: ActivityLog; Type: TABLE; Schema: public; Owner: snipeit
--

CREATE TABLE public."ActivityLog" (
    id text NOT NULL,
    action text NOT NULL,
    "itemType" text NOT NULL,
    "itemId" text NOT NULL,
    "itemName" text NOT NULL,
    "targetUserName" text,
    "adminName" text NOT NULL,
    "timestamp" text NOT NULL,
    notes text
);


ALTER TABLE public."ActivityLog" OWNER TO snipeit;

--
-- Name: Asset; Type: TABLE; Schema: public; Owner: snipeit
--

CREATE TABLE public."Asset" (
    id integer NOT NULL,
    "assetTag" text NOT NULL,
    name text NOT NULL,
    model text NOT NULL,
    category text NOT NULL,
    serial text NOT NULL,
    status text NOT NULL,
    "assignedToId" text,
    "assignedToName" text,
    "purchaseDate" text NOT NULL,
    "purchaseCost" double precision NOT NULL,
    notes text,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Asset" OWNER TO snipeit;

--
-- Name: Asset_id_seq; Type: SEQUENCE; Schema: public; Owner: snipeit
--

CREATE SEQUENCE public."Asset_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Asset_id_seq" OWNER TO snipeit;

--
-- Name: Asset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: snipeit
--

ALTER SEQUENCE public."Asset_id_seq" OWNED BY public."Asset".id;


--
-- Name: Consumable; Type: TABLE; Schema: public; Owner: snipeit
--

CREATE TABLE public."Consumable" (
    id text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    "modelNumber" text NOT NULL,
    "totalQuantity" integer NOT NULL,
    "remainingQuantity" integer NOT NULL,
    "minQuantity" integer NOT NULL,
    location text NOT NULL
);


ALTER TABLE public."Consumable" OWNER TO snipeit;

--
-- Name: EventItem; Type: TABLE; Schema: public; Owner: snipeit
--

CREATE TABLE public."EventItem" (
    id text NOT NULL,
    name text NOT NULL,
    department text NOT NULL,
    "startDate" text NOT NULL,
    "endDate" text NOT NULL,
    location text NOT NULL,
    "primaryRequesterId" text NOT NULL,
    "primaryRequesterName" text NOT NULL,
    "requesterIds" text[],
    "requesterNames" text[],
    "assetIds" text[],
    status text NOT NULL,
    "dispatchStatus" text NOT NULL,
    "purposeOrDescription" text NOT NULL,
    "expectedReturnDate" text,
    "contactPhone" text,
    "contactEmail" text,
    "projectCode" text,
    "specialInstructions" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."EventItem" OWNER TO snipeit;

--
-- Name: License; Type: TABLE; Schema: public; Owner: snipeit
--

CREATE TABLE public."License" (
    id text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    key text NOT NULL,
    "totalSeats" integer NOT NULL,
    "assignedUserIds" text[],
    "expirationDate" text NOT NULL,
    manufacturer text NOT NULL,
    "purchaseCost" double precision NOT NULL
);


ALTER TABLE public."License" OWNER TO snipeit;

--
-- Name: User; Type: TABLE; Schema: public; Owner: snipeit
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    role text DEFAULT 'Technician'::text NOT NULL,
    "employeeNum" text NOT NULL,
    department text NOT NULL,
    location text NOT NULL,
    "avatarUrl" text,
    "passwordHash" text
);


ALTER TABLE public."User" OWNER TO snipeit;

--
-- Name: Asset id; Type: DEFAULT; Schema: public; Owner: snipeit
--

ALTER TABLE ONLY public."Asset" ALTER COLUMN id SET DEFAULT nextval('public."Asset_id_seq"'::regclass);


--
-- Data for Name: Accessory; Type: TABLE DATA; Schema: public; Owner: snipeit
--

COPY public."Accessory" (id, name, category, "modelNumber", "totalQuantity", "remainingQuantity", "minQuantity", location) FROM stdin;
\.


--
-- Data for Name: ActivityLog; Type: TABLE DATA; Schema: public; Owner: snipeit
--

COPY public."ActivityLog" (id, action, "itemType", "itemId", "itemName", "targetUserName", "adminName", "timestamp", notes) FROM stdin;
\.


--
-- Data for Name: Asset; Type: TABLE DATA; Schema: public; Owner: snipeit
--

COPY public."Asset" (id, "assetTag", name, model, category, serial, status, "assignedToId", "assignedToName", "purchaseDate", "purchaseCost", notes, "updatedAt") FROM stdin;
46	AST-00046	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	22570F2000651	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.854
69	AST-00069	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	22371Y2001094	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.875
16	AST-00016	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	2237122001618	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.826
18	AST-00018	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	22484J8001248	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.827
19	AST-00019	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	224C6T9002681	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.828
20	AST-00020	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	2253029000924	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.829
21	AST-00021	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	2247262002922	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.83
22	AST-00022	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	22434Y5001620	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.831
23	AST-00023	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	22361A8002092	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.832
24	AST-00024	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	2223241001201	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.833
25	AST-00025	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	2247262002570	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.834
26	AST-00026	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	22484J8001010	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.835
27	AST-00027	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	2221117001438	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.836
28	AST-00028	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	22361A8001570	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.837
1	AST-00001	Gigabit Router	RB 4011 iGS+RM	Router	MMG0A35E6P2	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.804
2	AST-00002	Gigabit Router	RB 4011 iGS+RM	Router	HHG0ADGB9MH	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.808
3	AST-00003	Gigabit Router	RB 4011 iGS+RM	Router	HHG0A44FKWT	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.81
5	AST-00005	Gigabit Router	RB 4011 iGS+RM	Router	HGN09TAM48N	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.813
47	AST-00047	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	22570F2000661	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.855
48	AST-00048	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	223A4R5001081	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.856
49	AST-00049	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	22371Y2001146	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.857
50	AST-00050	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	22371Y2002113	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.858
29	AST-00029	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	22361A8002100	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.838
30	AST-00030	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	22361A8002152	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.839
31	AST-00031	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	22361A8003013	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.84
32	AST-00032	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	2221117001518	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.841
33	AST-00033	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	2223241001187	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.842
34	AST-00034	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	2247262002962	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.842
35	AST-00035	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	22484J8000789	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.843
36	AST-00036	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	22484J8000286	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.844
37	AST-00037	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	2247262002913	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.845
38	AST-00038	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	2247262002518	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.846
39	AST-00039	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	22484J8001281	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.847
40	AST-00040	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	22484J8000987	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.848
41	AST-00041	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	(Air)J6682TLVBZY	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.849
42	AST-00042	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	2247262002504	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.85
44	AST-00044	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	22484J8001244	Deployed	\N	\N	2024-01-01	199.99	PM Sanghralya for Tender	2026-09-29 09:10:28.158
45	AST-00045	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	22484J8001013	Deployed	\N	\N	2024-01-01	199.99	PM Sanghralya for Tender	2026-09-29 09:10:34.231
17	AST-00017	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	224C6T9002660	Deployed	\N	\N	2024-01-01	199.99	HP for replace	2026-09-29 09:21:32.994
43	AST-00043	POE Switch Manage SG-2210P	Tp-Link	Managed PoE Switch	22361A8002092	Deployed	\N	\N	2024-01-01	199.99	PM Sanghralya for Tender	2026-09-29 09:10:23.144
51	AST-00051	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	223A4R5001090	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.859
52	AST-00052	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	22371Y2002105	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.86
53	AST-00053	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	22371Y2002102	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.861
54	AST-00054	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	(Air)22371Y2002106	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.862
55	AST-00055	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	224C0L2000325	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.863
56	AST-00056	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	223A4R5000910	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.864
57	AST-00057	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	224C0L2001359	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.865
58	AST-00058	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	22371Y2001150	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.866
59	AST-00059	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	22371Y2002117	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.867
60	AST-00060	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	223A4R5001089	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.867
61	AST-00061	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	22371Y2001143	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.868
62	AST-00062	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	(Air)2235005000461	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.869
63	AST-00063	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	224C0L2000188	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.87
64	AST-00064	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	223A4R5001082	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.871
65	AST-00065	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	22371Y2002120	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.871
66	AST-00066	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	22371Y2002108	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.872
67	AST-00067	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	223A4R5001088	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.873
68	AST-00068	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	22371Y2001051	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.874
105	AST-00105	CRS 326	Mikrotik	Router	BF730B49CC40	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:39:01.531
106	AST-00106	CRS 326	Mikrotik	Router	HJ20ADTFANC	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:39:01.544
107	AST-00107	CRS 317	Mikrotik	Router	HCH08BP9QNJ	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:39:01.548
70	AST-00070	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	223A45001086	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.876
71	AST-00071	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	22371Y2001054	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.877
72	AST-00072	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	22371Y2001059	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.878
73	AST-00073	POE Switch unmanage SG-1210P	SG-1210P	Unmanaged PoE Switch	22271Y2002104	Ready to Deploy	\N	\N	2024-01-01	149.99	\N	2026-09-29 09:03:32.878
590	AST-00590	ONU XZ-000-G7	Tp-Link	ONU	224A083002774	Deployed	\N	\N	2026-09-29	0	\N	2026-09-29 10:12:46.701
587	AST-00587	ONU XZ-000-G7	Tp-Link	ONU	224A083002487	Deployed	\N	\N	2026-09-29	0	hp:\nDeployed in H-no 36 3floor masjid moth 	2026-09-29 10:15:01.29
588	AST-00588	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002420	Deployed	\N	\N	2026-09-29	0	hp:\nDeployed in Gouranga Viswas New Connection Masjid Moth 	2026-09-29 10:15:35.796
589	AST-00589	ONU XZ-000-G7	Tp-Link	ONU	2254368000023	Deployed	\N	\N	2026-09-29	0	hp:\nDeployed in Trivedi B5	2026-09-29 10:16:00.031
591	AST-00591	ONU XZ-000-G7	Tp-Link	ONU	2236058001062	Deployed	\N	\N	2026-09-29	0	hp:\nDeployed in lalrindiki416bn,	2026-09-29 10:16:54.458
592	AST-00592	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001644	Deployed	\N	\N	2026-09-29	0	hp:\nDeployed in Masjit Moth 309	2026-09-29 10:17:45.035
593	AST-00593	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002876	Deployed	\N	\N	2026-09-29	0	hp:\nDeployed in 270 A Masjid Moth	2026-09-29 10:19:14.298
594	AST-00594	ONU XZ-000-G7	Tp-Link	ONU	2236058001336	Deployed	\N	\N	2026-09-29	0	hp:\nDeployed in laxmibai nagar Broadband	2026-09-29 10:20:13.855
596	AST-00595	ONU XZ-000-G7	Tp-Link	ONU	2236058000844	Deployed	\N	\N	2026-09-29	0	hp:\nDeployed in 284 First Floor Masjid Moth	2026-09-29 10:23:21.507
7	AST-00007	Gigabit Router	RB 4011 iGS+RM	Router	MMG0ABM5ZQ	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.817
8	AST-00008	Gigabit Router	RB 4011 iGS+RM	Router	MMG0A3TPZ4	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.818
9	AST-00009	Gigabit Router	RB 4011 iGS+RM	Router	HK9AM8ZMG6	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.819
10	AST-00010	Gigabit Router	RB 4011 iGS+RM	Router	HHG0A5J37D4	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.82
11	AST-00011	Gigabit Router	RB 4011 iGS+RM	Router	HJN0AN64W1P	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.821
840	AST-00838	AP 650	Ruckus	Access Point	322139000389	Deployed	\N	\N	2026-09-30	0	NIUA	2026-09-30 05:20:19.439
12	AST-00012	Gigabit Router	RB 4011 iGS+RM	Router	HK90AJW82AF	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.822
13	AST-00013	Gigabit Router	RB 4011 iGS+RM	Router	HK90AWWPJPK	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.823
14	AST-00014	Gigabit Router	RB 4011 iGS+RM	Router	HK90AVRM9Y1	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.824
15	AST-00015	Gigabit Router	RB 4011 iGS+RM	Router	HHG0A2B8NTM	Ready to Deploy	\N	\N	2024-01-01	199.99	\N	2026-09-29 09:03:32.825
6	AST-00006	Gigabit Router	RB 4011 iGS+RM	Router	HHG0A1EHJ3N	Deployed	\N	\N	2024-01-01	199.99	IBPS Mumbai	2026-09-29 09:21:11.139
4	AST-00004	Gigabit Router	RB 4011 iGS+RM	Router	HGN09JTGH8W	Deployed	\N	\N	2024-01-01	199.99	Kolkata	2026-09-29 09:21:55.893
74	AST-00074	POE Switch Omada SG-3210XHP	Tp-Link	Switch	22471C4000205	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:16:47.001
75	AST-00075	POE Switch Omada SG-3210XHP	Tp-Link	Switch	22471C4000570	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:16:47.012
76	AST-00076	POE Switch Omada SG-3210XHP	Tp-Link	Switch	22471C4000551	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:16:47.016
77	AST-00077	POE Switch Omada SG-3210XHP	Tp-Link	Switch	22471C4000257	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:16:47.02
78	AST-00078	POE Switch Omada SG-3210XHP	Tp-Link	Switch	22471C4000097	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:16:47.023
79	AST-00079	POE Switch Omada SG-3210XHP	Tp-Link	Switch	22471C4000541	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:16:47.026
80	AST-00080	POE Switch Omada SG-3210XHP	Tp-Link	Switch	22471C4000508	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:16:47.03
81	AST-00081	POE Switch Omada SG-3210XHP	Tp-Link	Switch	22471C4000517	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:16:47.033
82	AST-00082	POE Switch Omada SG-3210XHP	Tp-Link	Switch	22471C4000080	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:16:47.037
83	AST-00083	POE Switch Omada SG-3210XHP	Tp-Link	Switch	22471C4000039	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:16:47.041
84	AST-00084	POE Switch Omada SG-3210XHP	Tp-Link	Switch	22471C4000308	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:16:47.044
85	AST-00085	POE Switch Omada SG-3210XHP	Tp-Link	Switch	22471C4000202	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:16:47.048
86	AST-00086	POE Switch Omada SG-3210XHP	Tp-Link	Switch	22471C4000424	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:16:47.051
87	AST-00087	POE Switch Omada SG-3210XHP	Tp-Link	Switch	22471C4000135	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:16:47.054
88	AST-00088	POE Switch Omada SG-3210XHP	Tp-Link	Switch	22471C4000189	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:16:47.057
89	AST-00089	POE Switch Omada SG-3210XHP	Tp-Link	Switch	22471C4000583	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:16:47.06
90	AST-00090	Switch 16 port SG1218	Tp-Link	Switch	22361E9001046	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:18:04.264
91	AST-00091	Switch 16 port SG1218	Tp-Link	Switch	22361E9001092	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:18:04.274
96	AST-00096	Tplink OLT DS-P7001-04	Tp-Link	OLT	788CB5BE959A	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:23:25.968
92	AST-00092	Tplink OLT DS-P7001-04	Tp-Link	OLT	222B001000064	Deployed	\N	\N	2026-09-29	0	HP - Mumbai	2026-09-29 09:24:17.665
93	AST-00093	Tplink OLT DS-P7001-04	Tp-Link	OLT	222B001000055	Deployed	\N	\N	2026-09-29	0	HP - Ahemdabad	2026-09-29 09:24:49.287
94	AST-00094	Tplink OLT DS-P7001-04	Tp-Link	OLT	22334Q6000093	Deployed	\N	\N	2026-09-29	0	HP - Office	2026-09-29 09:25:18.618
95	AST-00095	Tplink OLT DS-P7001-04	Tp-Link	OLT	22334Q6000095	Deployed	\N	\N	2026-09-29	0	HP - Office	2026-09-29 09:26:01.621
97	AST-00097	Tplink OLT DS-P7001-04	Tp-Link	OLT	22380F0000165	Deployed	\N	\N	2026-09-29	0	HP - JLN	2026-09-29 09:26:24.458
98	AST-00098	CCR 2004 2004-16G-2S+	Mikrotik	Router	HKE0AHEDNMN	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:28:22.745
99	AST-00099	CCR 2004 2004-16G-2S+	Mikrotik	Router	HJS0AYM1DM2	Deployed	\N	\N	2026-09-29	0	PM Sanghralaya Tender	2026-09-29 09:28:22.759
100	AST-00100	CCR 2004 2004-16G-2S+	Mikrotik	Router	HJS0AP3Q1Q4	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:28:22.766
101	AST-00101	CCR 2004 2004-16G-2S+	Mikrotik	Router	HKC0AHVGRF9	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:28:22.772
102	AST-00102	CCR 2004 2004-16G-2S+	Mikrotik	Router	HM40BCZ46DP	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:28:22.779
103	AST-00103	CCR 2004 2004-16G-2S+	Mikrotik	Router	HM40B0A4Y8J	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:28:22.787
104	AST-00104	CCR 1009	Mikrotik	Router	HD708BXJFS1	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:34:52.137
108	AST-00108	Cisco switch 24 Port 3650C	Cisco	Switch	FDO1949E11P	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:40:41.362
109	AST-00109	Cisco switch 24 Port 3650C	Cisco	Switch	FDO2235E1FC	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:40:41.376
110	AST-00110	Cisco switch 24 Port 3650C	Cisco	Switch	FDO2212Q1XU	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:40:41.383
111	AST-00111	Cisco switch 24 Port 3650C	Cisco	Switch	FDO2212Q27N	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:40:41.39
112	AST-00112	Cisco switch 24 Port 3650C	Cisco	Switch	FDO1929E1AT	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:40:41.397
113	AST-00113	Cisco switch 24 Port 3650C	Cisco	Switch	FDO1929P1EC	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:40:41.405
114	AST-00114	Cisco switch 24 Port 3650C	Cisco	Switch	FDO1929p1ED	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:40:41.412
115	AST-00115	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	225300H004847	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.18
116	AST-00116	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224A075011725	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.19
117	AST-00117	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2247710012268	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.193
118	AST-00118	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22484A8004081	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.197
119	AST-00119	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	225000R006571	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.2
120	AST-00120	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22560M0000633	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.203
121	AST-00121	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2211D05004188	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.206
122	AST-00122	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22482A5010481	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.209
123	AST-00123	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2250853013704	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.213
124	AST-00124	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2247710012535	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.216
125	AST-00125	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2150853012513	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.219
126	AST-00126	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2150853009623	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.221
127	AST-00127	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578MY003551	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.224
128	AST-00128	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	225300H004708	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.226
129	AST-00129	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22484A4008144	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.229
130	AST-00130	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224A075012317	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.231
131	AST-00131	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	0C83227D81CF	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.234
132	AST-00132	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224800H004804	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.236
133	AST-00133	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578MY002070	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.239
134	AST-00134	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	225601R012318	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.242
135	AST-00135	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224A075012235	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.244
136	AST-00136	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224A075002808	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.247
137	AST-00137	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2147710002480	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.25
138	AST-00138	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578MY003570	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.252
139	AST-00139	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2147710007165	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.254
140	AST-00140	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224A075012564	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.257
141	AST-00141	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578MY001178	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.259
142	AST-00142	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578Z7011732	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.261
143	AST-00143	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578MY003161	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.264
144	AST-00144	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224400R004259	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.266
145	AST-00145	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578MY002868	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.268
146	AST-00146	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	WIFI:T:WPA;S:TP-Link_66FC;P:57035424;	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.271
147	AST-00147	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224A075006577	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.273
148	AST-00148	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	225300H002515	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.276
149	AST-00149	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578MY003577	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.279
150	AST-00150	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2147997018023	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.281
151	AST-00151	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2147710011500	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.284
152	AST-00152	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2250842006445	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.286
153	AST-00153	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2247710012893	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.289
154	AST-00154	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2258329005193	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.291
155	AST-00155	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578Z7010791	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.294
156	AST-00156	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	WIFI:T:WPA;S:TP-Link_12C0;P:27826234;	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.296
157	AST-00157	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578MY000766	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.299
158	AST-00158	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224C552019223	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.301
159	AST-00159	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2250842006615	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.304
160	AST-00160	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	225601R007511	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.306
161	AST-00161	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2150853013713	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.308
162	AST-00162	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	(Air)80RNMJDY2YS	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.311
163	AST-00163	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	WIFI:T:WPA;S:TP-Link_E88A;P:89555974;	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.313
164	AST-00164	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	98DA8DE63121	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.315
165	AST-00165	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	225601R006557	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.318
166	AST-00166	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578MY004080	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.32
167	AST-00167	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224A075002889	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.323
168	AST-00168	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2250842006324	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.326
169	AST-00169	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	225300H004872	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.328
170	AST-00170	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578MY001365	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.331
171	AST-00171	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578MY004089	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.333
172	AST-00172	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	503DD1DD0915	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.336
173	AST-00173	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2150842002629	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.339
174	AST-00174	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2150842004501	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.344
175	AST-00175	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2256033004764	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.349
176	AST-00176	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2256033004855	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.353
177	AST-00177	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	225601R007193	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.356
178	AST-00178	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2258329003305	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.359
179	AST-00179	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224A075002998	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.362
180	AST-00180	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2217710011904	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.364
181	AST-00181	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224A075006706	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.367
182	AST-00182	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2257527011156	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.37
183	AST-00183	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2257527011150	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.373
184	AST-00184	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224A075014206	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.375
185	AST-00185	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2147710015514	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.378
186	AST-00186	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2150853004750	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.381
187	AST-00187	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2256033004145	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.383
188	AST-00188	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2247721012204	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.386
189	AST-00189	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	225300H002927	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.389
190	AST-00190	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224C455005928	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.391
191	AST-00191	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2248529004952	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.394
192	AST-00192	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	(Air)R07DBL81R1P	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.397
193	AST-00193	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	225601R006812	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.399
194	AST-00194	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224C1T8018563	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.402
195	AST-00195	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2258329006567	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.404
196	AST-00196	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2150853001030	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.406
197	AST-00197	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2256033012039	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.409
198	AST-00198	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	(Air)UM8RUQ8E2CS	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.411
199	AST-00199	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	225601R007255	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.413
200	AST-00200	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2256033015500	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.416
201	AST-00201	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2258842004515	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.418
202	AST-00202	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2258342008765	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.42
203	AST-00203	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	225601R004143	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.422
204	AST-00204	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2250842006357	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.425
205	AST-00205	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	(Air)JQHDVUM5BXI	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.427
206	AST-00206	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2258329005153	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.43
207	AST-00207	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224C1T8018659	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.432
208	AST-00208	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224A075013198	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.434
209	AST-00209	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2157527011568	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.437
210	AST-00210	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22561W3004089	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.439
211	AST-00211	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2250842006645	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.442
212	AST-00212	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2257527012086	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.444
213	AST-00213	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2256033008215	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.446
214	AST-00214	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224C552014792	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.448
215	AST-00215	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2256033008217	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.451
216	AST-00216	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2117710007604	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.453
217	AST-00217	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2256033007167	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.455
218	AST-00218	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2156033002921	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.458
219	AST-00219	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2157527011131	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.46
220	AST-00220	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2248529010501	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.463
221	AST-00221	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	(Air)RD7R5V69GJ1	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.465
222	AST-00222	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2147710018137	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.468
223	AST-00223	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2157527013315	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.47
224	AST-00224	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578MY003980	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.472
225	AST-00225	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2247710012288	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.475
226	AST-00226	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2257527011097	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.477
227	AST-00227	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578MY002217	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.479
228	AST-00228	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	225300H002548	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.482
229	AST-00229	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2258329005161	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.484
230	AST-00230	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2156033007506	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.486
231	AST-00231	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	225601R007310	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.489
232	AST-00232	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2156033004680	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.491
233	AST-00233	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2157527003460	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.494
234	AST-00234	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2256033012767	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.497
235	AST-00235	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2256033004682	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.499
236	AST-00236	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2256033012823	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.501
237	AST-00237	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578MY001355	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.504
238	AST-00238	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2247710002196	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.506
239	AST-00239	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224A075001872	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.509
240	AST-00240	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224A075001887	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.511
241	AST-00241	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578MY000609	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.514
242	AST-00242	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224A075012693	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.516
243	AST-00243	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224C1T8016032	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.519
244	AST-00244	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2156033001503	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.521
245	AST-00245	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2150842006046	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.523
246	AST-00246	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2150842004352	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.526
247	AST-00247	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224A075001345	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.528
248	AST-00248	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	225601R002533	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.531
249	AST-00249	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22482A5007197	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.533
250	AST-00250	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2147710013542	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.536
251	AST-00251	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22482A5010128	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.538
252	AST-00252	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	224A075006748	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.54
253	AST-00253	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2256033008031	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.543
254	AST-00254	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	WIFI:T:WPA;S:TP-Link_8DDD;P:45413922;	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.545
255	AST-00255	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578MY002008	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.547
256	AST-00256	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578MY003797	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.549
257	AST-00257	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2150842005502	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.551
258	AST-00258	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	225601R006533	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.554
259	AST-00259	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2147710012215	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.556
260	AST-00260	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	22578MY001348	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.558
261	AST-00261	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	2147710015273	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.561
262	AST-00262	Router 1200 AC 1200 C6	Tp-Link	Dual Band Router	(Air)W5W2B0D2JWY	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:42:57.563
263	AST-00263	Router 1500 AX 1500	Tp-Link	Dual Band Router	22381F3002367	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.926
264	AST-00264	Router 1500 AX 1500	Tp-Link	Dual Band Router	22381F3002366	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.939
265	AST-00265	Router 1500 AX 1500	Tp-Link	Dual Band Router	22381F3002370	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.943
266	AST-00266	Router 1500 AX 1500	Tp-Link	Dual Band Router	22381F3004831	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.947
267	AST-00267	Router 1500 AX 1500	Tp-Link	Dual Band Router	22351A4006644	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.95
268	AST-00268	Router 1500 AX 1500	Tp-Link	Dual Band Router	22381F3002543	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.954
269	AST-00269	Router 1500 AX 1500	Tp-Link	Dual Band Router	22351A4007193	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.957
270	AST-00270	Router 1500 AX 1500	Tp-Link	Dual Band Router	22351A4007194	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.961
271	AST-00271	Router 1500 AX 1500	Tp-Link	Dual Band Router	22351A4003989	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.965
272	AST-00272	Router 1500 AX 1500	Tp-Link	Dual Band Router	22351A4003988	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.969
273	AST-00273	Router 1500 AX 1500	Tp-Link	Dual Band Router	22351A4003982	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.972
274	AST-00274	Router 1500 AX 1500	Tp-Link	Dual Band Router	22351A4006761	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.974
275	AST-00275	Router 1500 AX 1500	Tp-Link	Dual Band Router	22381F3002368	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.977
276	AST-00276	Router 1500 AX 1500	Tp-Link	Dual Band Router	22351A4005658	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.98
277	AST-00277	Router 1500 AX 1500	Tp-Link	Dual Band Router	22381F3004838	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.982
278	AST-00278	Router 1500 AX 1500	Tp-Link	Dual Band Router	22381F8002542	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.984
279	AST-00279	Router 1500 AX 1500	Tp-Link	Dual Band Router	22381F3004994	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.987
280	AST-00280	Router 1500 AX 1500	Tp-Link	Dual Band Router	22381F3004837	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.989
281	AST-00281	Router 1500 AX 1500	Tp-Link	Dual Band Router	22351A4004007	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.992
282	AST-00282	Router 1500 AX 1500	Tp-Link	Dual Band Router	22351A4006643	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:44:20.994
283	AST-00283	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675002537	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.566
284	AST-00284	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000646	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.58
285	AST-00285	Router 1800 Archer AX23	Tp-Link	Dual Band Router	22491J6002951	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.584
286	AST-00286	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000027	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.587
287	AST-00287	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000060	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.591
288	AST-00288	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000028	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.594
289	AST-00289	Router 1800 Archer AX23	Tp-Link	Dual Band Router	22491J6002975	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.597
290	AST-00290	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000671	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.6
291	AST-00291	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000783	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.604
292	AST-00292	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675001520	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.608
293	AST-00293	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000514	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.611
294	AST-00294	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675002531	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.613
295	AST-00295	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675001557	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.616
296	AST-00296	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675002570	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.619
297	AST-00297	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000995	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.622
298	AST-00298	Router 1800 Archer AX23	Tp-Link	Dual Band Router	223A3Y6001440	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.624
299	AST-00299	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675002305	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.627
300	AST-00300	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675002277	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.629
301	AST-00301	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000976	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.632
302	AST-00302	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000551	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.634
303	AST-00303	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000621	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.637
304	AST-00304	Router 1800 Archer AX23	Tp-Link	Dual Band Router	22491J6002952	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.639
305	AST-00305	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000071	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.642
306	AST-00306	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000291	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.644
307	AST-00307	Router 1800 Archer AX23	Tp-Link	Dual Band Router	WIFI:T:WPA;S:TP-Link_DC5C;P:87031621;	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.646
308	AST-00308	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675002752	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.648
309	AST-00309	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000588	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.651
310	AST-00310	Router 1800 Archer AX23	Tp-Link	Dual Band Router	22491J6002970	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.653
311	AST-00311	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675001377	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.656
312	AST-00312	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000996	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.658
313	AST-00313	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675001311	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.66
314	AST-00314	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000046	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.662
315	AST-00315	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000022	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.665
316	AST-00316	Router 1800 Archer AX23	Tp-Link	Dual Band Router	22590XM000913	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.667
317	AST-00317	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675002794	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.669
318	AST-00318	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000523	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.672
319	AST-00319	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000181	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.674
320	AST-00320	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675001484	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.676
321	AST-00321	Router 1800 Archer AX23	Tp-Link	Dual Band Router	22590XM001006	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.679
322	AST-00322	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000647	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.681
323	AST-00323	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675001913	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.684
324	AST-00324	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675001433	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.686
325	AST-00325	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675002145	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.688
326	AST-00326	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000789	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.69
327	AST-00327	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000152	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.693
328	AST-00328	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675001553	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.695
329	AST-00329	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675001917	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.697
330	AST-00330	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675001549	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.699
331	AST-00331	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675002734	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.702
332	AST-00332	Router 1800 Archer AX23	Tp-Link	Dual Band Router	22590XM001010	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.704
333	AST-00333	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675002617	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.706
334	AST-00334	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000781	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.708
335	AST-00335	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224C0N4002002	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.71
336	AST-00336	Router 1800 Archer AX23	Tp-Link	Dual Band Router	22491J6002935	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.712
337	AST-00337	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675001534	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.714
338	AST-00338	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000672	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.717
339	AST-00339	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000641	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.719
340	AST-00340	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000472	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.721
341	AST-00341	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000587	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.723
342	AST-00342	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000049	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.725
343	AST-00343	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675001424	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.728
344	AST-00344	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000145	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.73
345	AST-00345	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675002338	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.732
346	AST-00346	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000532	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.734
347	AST-00347	Router 1800 Archer AX23	Tp-Link	Dual Band Router	22491J6002960	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.736
348	AST-00348	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675002293	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.739
349	AST-00349	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675000524	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.741
350	AST-00350	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675001514	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.744
351	AST-00351	Router 1800 Archer AX23	Tp-Link	Dual Band Router	22491J6002947	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.746
352	AST-00352	Router 1800 Archer AX23	Tp-Link	Dual Band Router	224B675002413	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 09:54:21.748
353	AST-00353	ONU XZ-000-G7	Tp-Link	ONU	2236058000818	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:04:17.9
354	AST-00354	ONU XZ-000-G7	Tp-Link	ONU	2254368000545	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:04:17.915
355	AST-00355	ONU XZ-000-G7	Tp-Link	ONU	2236058001381	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:04:17.922
356	AST-00356	ONU XZ-000-G7	Tp-Link	ONU	22382P5001438	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:04:17.929
357	AST-00357	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001561	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:04:17.936
358	AST-00358	ONU XZ-000-G7	Tp-Link	ONU	22382P5001289	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:04:17.942
359	AST-00359	ONU XZ-000-G7	Tp-Link	ONU	2236058001812	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:04:17.948
360	AST-00360	ONU XZ-000-G7	Tp-Link	ONU	22382P5001068	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:04:17.954
361	AST-00361	ONU XZ-000-G7	Tp-Link	ONU	2254368000188	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:04:17.961
362	AST-00362	ONU XZ-000-G7	Tp-Link	ONU	224A083001504	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:14.918
363	AST-00363	ONU XZ-000-G7	Tp-Link	ONU	224A083002404	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:14.932
364	AST-00364	ONU XZ-000-G7	Tp-Link	ONU	22382P5002793	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:14.94
365	AST-00365	ONU XZ-000-G7	Tp-Link	ONU	22382P5000753	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:14.947
366	AST-00366	ONU XZ-000-G7	Tp-Link	ONU	22382P5001291	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:14.952
367	AST-00367	ONU XZ-000-G7	Tp-Link	ONU	2248080025360	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:14.96
368	AST-00368	ONU XZ-000-G7	Tp-Link	ONU	2254368000632	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:14.967
369	AST-00369	ONU XZ-000-G7	Tp-Link	ONU	22341P7001856	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:14.973
370	AST-00370	ONU XZ-000-G7	Tp-Link	ONU	2254268000266	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:14.98
371	AST-00371	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001601	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:14.986
372	AST-00372	ONU XZ-000-G7	Tp-Link	ONU	223C538000405	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:14.992
373	AST-00373	ONU XZ-000-G7	Tp-Link	ONU	22364N5001130	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:14.999
374	AST-00374	ONU XZ-000-G7	Tp-Link	ONU	22382P5001172	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:15.004
375	AST-00375	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002389	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:15.009
376	AST-00376	ONU XZ-000-G7	Tp-Link	ONU	22382P5001148	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:15.014
377	AST-00377	ONU XZ-000-G7	Tp-Link	ONU	22382P5001111	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:15.019
378	AST-00378	ONU XZ-000-G7	Tp-Link	ONU	224A083000937	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:15.027
379	AST-00379	ONU XZ-000-G7	Tp-Link	ONU	224A083002578	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:15.034
380	AST-00380	ONU XZ-000-G7	Tp-Link	ONU	2236058001364	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:15.039
381	AST-00381	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002663	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:15.045
382	AST-00382	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002796	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:15.051
383	AST-00383	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001449	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:15.058
384	AST-00384	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002524	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:15.065
385	AST-00385	ONU XZ-000-G7	Tp-Link	ONU	2236058001947	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:15.074
386	AST-00386	ONU XZ-000-G7	Tp-Link	ONU	22382P5001374	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:15.082
387	AST-00387	ONU XZ-000-G7	Tp-Link	ONU	22382P5001275	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.815
388	AST-00388	ONU XZ-000-G7	Tp-Link	ONU	2254368002177	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.824
389	AST-00389	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001581	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.827
390	AST-00390	ONU XZ-000-G7	Tp-Link	ONU	2254368002191	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.831
391	AST-00391	ONU XZ-000-G7	Tp-Link	ONU	22382P5001266	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.834
392	AST-00392	ONU XZ-000-G7	Tp-Link	ONU	22382P5001419	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.836
393	AST-00393	ONU XZ-000-G7	Tp-Link	ONU	22382P5002612	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.839
394	AST-00394	ONU XZ-000-G7	Tp-Link	ONU	224A083002564	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.842
395	AST-00395	ONU XZ-000-G7	Tp-Link	ONU	22382P5001393	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.845
396	AST-00396	ONU XZ-000-G7	Tp-Link	ONU	22382P5001320	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.848
397	AST-00397	ONU XZ-000-G7	Tp-Link	ONU	22341P7001245	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.851
398	AST-00398	ONU XZ-000-G7	Tp-Link	ONU	2236058000957	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.854
399	AST-00399	ONU XZ-000-G7	Tp-Link	ONU	2254258000131	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.857
400	AST-00400	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001398	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.86
401	AST-00401	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001617	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.865
402	AST-00402	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002623	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.867
403	AST-00403	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002409	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.869
404	AST-00404	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001413	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.872
405	AST-00405	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001447	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.874
406	AST-00406	ONU XZ-000-G7	Tp-Link	ONU	2236058001405	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.877
407	AST-00407	ONU XZ-000-G7	Tp-Link	ONU	224A083002807	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.879
408	AST-00408	ONU XZ-000-G7	Tp-Link	ONU	22341P7001014	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.882
409	AST-00409	ONU XZ-000-G7	Tp-Link	ONU	224A083001557	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.885
410	AST-00410	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002863	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.887
411	AST-00411	ONU XZ-000-G7	Tp-Link	ONU	2254369000628	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:05:48.889
412	AST-00412	ONU XZ-000-G7	Tp-Link	ONU	224A083002589	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.575
413	AST-00413	ONU XZ-000-G7	Tp-Link	ONU	224A083002614	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.59
414	AST-00414	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002378	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.597
415	AST-00415	ONU XZ-000-G7	Tp-Link	ONU	2236058002001	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.604
416	AST-00416	ONU XZ-000-G7	Tp-Link	ONU	2254368000595	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.611
417	AST-00417	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001476	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.617
418	AST-00418	ONU XZ-000-G7	Tp-Link	ONU	2236058001459	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.622
419	AST-00419	ONU XZ-000-G7	Tp-Link	ONU	22341P7001887	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.628
420	AST-00420	ONU XZ-000-G7	Tp-Link	ONU	2236058001416	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.634
421	AST-00421	ONU XZ-000-G7	Tp-Link	ONU	2254368000620	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.641
422	AST-00422	ONU XZ-000-G7	Tp-Link	ONU	224A083002628	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.646
423	AST-00423	ONU XZ-000-G7	Tp-Link	ONU	22382P5001258	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.652
424	AST-00424	ONU XZ-000-G7	Tp-Link	ONU	22382P5001108	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.658
425	AST-00425	ONU XZ-000-G7	Tp-Link	ONU	224A083002411	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.663
426	AST-00426	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001494	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.67
427	AST-00427	ONU XZ-000-G7	Tp-Link	ONU	2254368000180	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.676
428	AST-00428	ONU XZ-000-G7	Tp-Link	ONU	22382P5001160	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.681
429	AST-00429	ONU XZ-000-G7	Tp-Link	ONU	2236059002002	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.686
430	AST-00430	ONU XZ-000-G7	Tp-Link	ONU	224A083002508	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.692
431	AST-00431	ONU XZ-000-G7	Tp-Link	ONU	224A083002588	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.698
432	AST-00432	ONU XZ-000-G7	Tp-Link	ONU	2254368000567	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.705
433	AST-00433	ONU XZ-000-G7	Tp-Link	ONU	224A083002558	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.711
434	AST-00434	ONU XZ-000-G7	Tp-Link	ONU	2254368000117	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.716
435	AST-00435	ONU XZ-000-G7	Tp-Link	ONU	2254368002217	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.721
436	AST-00436	ONU XZ-000-G7	Tp-Link	ONU	22382P5001030	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:22.726
437	AST-00437	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002416	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.906
438	AST-00438	ONU XZ-000-G7	Tp-Link	ONU	224A083001118	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.917
439	AST-00439	ONU XZ-000-G7	Tp-Link	ONU	224A083001531	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.921
440	AST-00440	ONU XZ-000-G7	Tp-Link	ONU	2254368000082	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.924
441	AST-00441	ONU XZ-000-G7	Tp-Link	ONU	22382P5001249	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.927
442	AST-00442	ONU XZ-000-G7	Tp-Link	ONU	2254368000599	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.93
443	AST-00443	ONU XZ-000-G7	Tp-Link	ONU	2254368000253	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.933
444	AST-00444	ONU XZ-000-G7	Tp-Link	ONU	224A083002489	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.935
445	AST-00445	ONU XZ-000-G7	Tp-Link	ONU	22382P5001188	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.939
446	AST-00446	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001623	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.942
447	AST-00447	ONU XZ-000-G7	Tp-Link	ONU	2254368000071	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.945
448	AST-00448	ONU XZ-000-G7	Tp-Link	ONU	22364N5000563	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.947
449	AST-00449	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002423	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.95
450	AST-00450	ONU XZ-000-G7	Tp-Link	ONU	22382P5001350	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.953
451	AST-00451	ONU XZ-000-G7	Tp-Link	ONU	2236058001987	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.955
452	AST-00452	ONU XZ-000-G7	Tp-Link	ONU	224A083002451	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.958
453	AST-00453	ONU XZ-000-G7	Tp-Link	ONU	22341P7002943	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.961
454	AST-00454	ONU XZ-000-G7	Tp-Link	ONU	2236058000874	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.963
455	AST-00455	ONU XZ-000-G7	Tp-Link	ONU	224A083002519	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.966
456	AST-00456	ONU XZ-000-G7	Tp-Link	ONU	2254368000104	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.968
457	AST-00457	ONU XZ-000-G7	Tp-Link	ONU	2254368000290	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.971
458	AST-00458	ONU XZ-000-G7	Tp-Link	ONU	2236058000847	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.973
459	AST-00459	ONU XZ-000-G7	Tp-Link	ONU	22382P5001094	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.976
460	AST-00460	ONU XZ-000-G7	Tp-Link	ONU	2236058001143	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.979
461	AST-00461	ONU XZ-000-G7	Tp-Link	ONU	2254368000182	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:06:54.981
462	AST-00462	ONU XZ-000-G7	Tp-Link	ONU	2254368000607	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.115
463	AST-00463	ONU XZ-000-G7	Tp-Link	ONU	224A083002540	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.132
464	AST-00464	ONU XZ-000-G7	Tp-Link	ONU	2254368000016	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.139
465	AST-00465	ONU XZ-000-G7	Tp-Link	ONU	224A083001130	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.147
466	AST-00466	ONU XZ-000-G7	Tp-Link	ONU	224A083001840	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.155
467	AST-00467	ONU XZ-000-G7	Tp-Link	ONU	22382P5001066	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.163
468	AST-00468	ONU XZ-000-G7	Tp-Link	ONU	223C538005185	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.171
469	AST-00469	ONU XZ-000-G7	Tp-Link	ONU	2254368000067	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.18
470	AST-00470	ONU XZ-000-G7	Tp-Link	ONU	22341P7000462	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.188
471	AST-00471	ONU XZ-000-G7	Tp-Link	ONU	2254368000054	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.197
472	AST-00472	ONU XZ-000-G7	Tp-Link	ONU	2254368000005	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.204
473	AST-00473	ONU XZ-000-G7	Tp-Link	ONU	2254368000065	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.21
474	AST-00474	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002608	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.216
475	AST-00475	ONU XZ-000-G7	Tp-Link	ONU	224A083002506	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.221
476	AST-00476	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002458	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.227
477	AST-00477	ONU XZ-000-G7	Tp-Link	ONU	2236058001407	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.234
478	AST-00478	ONU XZ-000-G7	Tp-Link	ONU	2254368002281	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.24
479	AST-00479	ONU XZ-000-G7	Tp-Link	ONU	2254368000211	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.246
480	AST-00480	ONU XZ-000-G7	Tp-Link	ONU	22382P5001100	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.252
481	AST-00481	ONU XZ-000-G7	Tp-Link	ONU	224A083002536	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.258
482	AST-00482	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001603	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.265
483	AST-00483	ONU XZ-000-G7	Tp-Link	ONU	2254368000601	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.27
484	AST-00484	ONU XZ-000-G7	Tp-Link	ONU	224A083002428	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.277
485	AST-00485	ONU XZ-000-G7	Tp-Link	ONU	2254368000654	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.282
486	AST-00486	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002445	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:13.289
487	AST-00487	ONU XZ-000-G7	Tp-Link	ONU	2254368002278	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.266
488	AST-00488	ONU XZ-000-G7	Tp-Link	ONU	2236058000867	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.278
489	AST-00489	ONU XZ-000-G7	Tp-Link	ONU	224A083002970	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.282
490	AST-00490	ONU XZ-000-G7	Tp-Link	ONU	224A083001339	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.285
491	AST-00491	ONU XZ-000-G7	Tp-Link	ONU	224A083002423	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.288
492	AST-00492	ONU XZ-000-G7	Tp-Link	ONU	224A083002747	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.292
493	AST-00493	ONU XZ-000-G7	Tp-Link	ONU	22382P5001133	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.295
494	AST-00494	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001665	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.298
495	AST-00495	ONU XZ-000-G7	Tp-Link	ONU	22382P5001230	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.302
496	AST-00496	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001640	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.306
497	AST-00497	ONU XZ-000-G7	Tp-Link	ONU	223C538005637	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.309
498	AST-00498	ONU XZ-000-G7	Tp-Link	ONU	22341P7001850	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.312
499	AST-00499	ONU XZ-000-G7	Tp-Link	ONU	22382P5001177	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.315
500	AST-00500	ONU XZ-000-G7	Tp-Link	ONU	224A083002608	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.319
501	AST-00501	ONU XZ-000-G7	Tp-Link	ONU	22341P7001833	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.322
502	AST-00502	ONU XZ-000-G7	Tp-Link	ONU	224A083000964	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.324
503	AST-00503	ONU XZ-000-G7	Tp-Link	ONU	22341P7001527	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.327
504	AST-00504	ONU XZ-000-G7	Tp-Link	ONU	224A083002539	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.329
505	AST-00505	ONU XZ-000-G7	Tp-Link	ONU	223C538000177	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.332
506	AST-00506	ONU XZ-000-G7	Tp-Link	ONU	22382P5001070	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.335
507	AST-00507	ONU XZ-000-G7	Tp-Link	ONU	224A083002729	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.338
508	AST-00508	ONU XZ-000-G7	Tp-Link	ONU	2254368002293	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.341
509	AST-00509	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002653	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.343
510	AST-00510	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001590	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.346
511	AST-00511	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002670	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:08:50.348
512	AST-00512	ONU XZ-000-G7	Tp-Link	ONU	2254368000613	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.281
513	AST-00513	ONU XZ-000-G7	Tp-Link	ONU	22382P5001433	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.291
514	AST-00514	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001611	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.295
515	AST-00515	ONU XZ-000-G7	Tp-Link	ONU	2254368000622	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.298
516	AST-00516	ONU XZ-000-G7	Tp-Link	ONU	224A083002537	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.301
517	AST-00517	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002915	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.304
518	AST-00518	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002466	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.306
519	AST-00519	ONU XZ-000-G7	Tp-Link	ONU	2236058001464	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.309
520	AST-00520	ONU XZ-000-G7	Tp-Link	ONU	2236058001604	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.313
521	AST-00521	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002567	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.316
522	AST-00522	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002723	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.319
523	AST-00523	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002803	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.321
524	AST-00524	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002648	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.324
525	AST-00525	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001527	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.327
526	AST-00526	ONU XZ-000-G7	Tp-Link	ONU	22382P5001242	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.329
527	AST-00527	ONU XZ-000-G7	Tp-Link	ONU	224A083002416	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.331
528	AST-00528	ONU XZ-000-G7	Tp-Link	ONU	2254368000660	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.334
529	AST-00529	ONU XZ-000-G7	Tp-Link	ONU	224A083002415	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.336
530	AST-00530	ONU XZ-000-G7	Tp-Link	ONU	22341P7001070	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.339
531	AST-00531	ONU XZ-000-G7	Tp-Link	ONU	223C538005605	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.341
532	AST-00532	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001507	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.345
533	AST-00533	ONU XZ-000-G7	Tp-Link	ONU	224C0M1005603	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.348
534	AST-00534	ONU XZ-000-G7	Tp-Link	ONU	22382P5001431	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.35
535	AST-00535	ONU XZ-000-G7	Tp-Link	ONU	224A083001472	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.352
536	AST-00536	ONU XZ-000-G7	Tp-Link	ONU	22382P5001330	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:22.355
537	AST-00537	ONU XZ-000-G7	Tp-Link	ONU	2254368000283	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.656
538	AST-00538	ONU XZ-000-G7	Tp-Link	ONU	2254368000171	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.669
539	AST-00539	ONU XZ-000-G7	Tp-Link	ONU	2254368000602	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.672
540	AST-00540	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002821	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.675
541	AST-00541	ONU XZ-000-G7	Tp-Link	ONU	224A083002463	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.678
542	AST-00542	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001430	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.681
543	AST-00543	ONU XZ-000-G7	Tp-Link	ONU	2236058001420	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.684
544	AST-00544	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002443	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.686
545	AST-00545	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002596	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.69
546	AST-00546	ONU XZ-000-G7	Tp-Link	ONU	22382P500199	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.694
547	AST-00547	ONU XZ-000-G7	Tp-Link	ONU	224A083001255	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.697
548	AST-00548	ONU XZ-000-G7	Tp-Link	ONU	2254368000322	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.699
549	AST-00549	ONU XZ-000-G7	Tp-Link	ONU	224A083002063	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.702
550	AST-00550	ONU XZ-000-G7	Tp-Link	ONU	224A083002700	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.704
551	AST-00551	ONU XZ-000-G7	Tp-Link	ONU	22341P7001145	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.706
552	AST-00552	ONU XZ-000-G7	Tp-Link	ONU	22382P5001236	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.708
553	AST-00553	ONU XZ-000-G7	Tp-Link	ONU	22382P5001169	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.711
554	AST-00554	ONU XZ-000-G7	Tp-Link	ONU	2254368000120	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.713
555	AST-00555	ONU XZ-000-G7	Tp-Link	ONU	224A083002505	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.715
556	AST-00556	ONU XZ-000-G7	Tp-Link	ONU	22382P5001257	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.717
557	AST-00557	ONU XZ-000-G7	Tp-Link	ONU	22382P5000747	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.72
558	AST-00558	ONU XZ-000-G7	Tp-Link	ONU	224A083002574	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.722
559	AST-00559	ONU XZ-000-G7	Tp-Link	ONU	2236058000914	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.724
560	AST-00560	ONU XZ-000-G7	Tp-Link	ONU	22382P5002394	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.727
561	AST-00561	ONU XZ-000-G7	Tp-Link	ONU	224A083002447	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:09:58.729
562	AST-00562	ONU XZ-000-G7	Tp-Link	ONU	2254368002181	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:10.938
563	AST-00563	ONU XZ-000-G7	Tp-Link	ONU	22382P5001360	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:10.949
564	AST-00564	ONU XZ-000-G7	Tp-Link	ONU	22364N5000903	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:10.952
565	AST-00565	ONU XZ-000-G7	Tp-Link	ONU	224C0M1002385	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:10.956
566	AST-00566	ONU XZ-000-G7	Tp-Link	ONU	224A083002610	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:10.96
567	AST-00567	ONU XZ-000-G7	Tp-Link	ONU	2254368000178	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:10.963
568	AST-00568	ONU XZ-000-G7	Tp-Link	ONU	2254368000055	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:10.966
569	AST-00569	ONU XZ-000-G7	Tp-Link	ONU	2254368000570	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:10.969
570	AST-00570	ONU XZ-000-G7	Tp-Link	ONU	224A083001322	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:10.973
571	AST-00571	ONU XZ-000-G7	Tp-Link	ONU	224C0M1001491	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:10.977
572	AST-00572	ONU XZ-000-G7	Tp-Link	ONU	2254368000105	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:10.98
573	AST-00573	ONU XZ-000-G7	Tp-Link	ONU	224A083002434	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:10.983
574	AST-00574	ONU XZ-000-G7	Tp-Link	ONU	22382P5001046	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:10.986
575	AST-00575	ONU XZ-000-G7	Tp-Link	ONU	2254368000125	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:10.989
576	AST-00576	ONU XZ-000-G7	Tp-Link	ONU	2236058001110	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:10.992
577	AST-00577	ONU XZ-000-G7	Tp-Link	ONU	224A083002496	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:10.994
578	AST-00578	ONU XZ-000-G7	Tp-Link	ONU	22382P5001116	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:10.997
579	AST-00579	ONU XZ-000-G7	Tp-Link	ONU	2254368000013	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:10.999
580	AST-00580	ONU XZ-000-G7	Tp-Link	ONU	224A083001456	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:11.002
581	AST-00581	ONU XZ-000-G7	Tp-Link	ONU	224A083002715	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:11.004
582	AST-00582	ONU XZ-000-G7	Tp-Link	ONU	2236058001078	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:11.007
583	AST-00583	ONU XZ-000-G7	Tp-Link	ONU	2236058001036	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:11.01
584	AST-00584	ONU XZ-000-G7	Tp-Link	ONU	224A083002024	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:11.013
585	AST-00585	ONU XZ-000-G7	Tp-Link	ONU	2254368000056	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:11.015
586	AST-00586	ONU XZ-000-G7	Tp-Link	ONU	223C538000508	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:11:11.018
598	AST-00596	AP 660 Omada AX-3600HD	Tp-Link	Access Point	224B4X9001621	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.624
599	AST-00597	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2244753001648	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.637
600	AST-00598	AP 660 Omada AX-3600HD	Tp-Link	Access Point	22495C3000098	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.644
601	AST-00599	AP 660 Omada AX-3600HD	Tp-Link	Access Point	22411C0000862	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.651
602	AST-00600	AP 660 Omada AX-3600HD	Tp-Link	Access Point	224B4X9001610	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.657
603	AST-00601	AP 660 Omada AX-3600HD	Tp-Link	Access Point	22495C3000114	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.663
604	AST-00602	AP 660 Omada AX-3600HD	Tp-Link	Access Point	22411C0000814	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.669
605	AST-00603	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2244753001482	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.675
606	AST-00604	AP 660 Omada AX-3600HD	Tp-Link	Access Point	224B4X9000007	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.682
607	AST-00605	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2244753001767	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.688
608	AST-00606	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2244753001703	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.694
609	AST-00607	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2248171000598	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.7
610	AST-00608	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2244753001754	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.706
611	AST-00609	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2222357000743	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.713
612	AST-00610	AP 660 Omada AX-3600HD	Tp-Link	Access Point	22495C3000018	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.72
613	AST-00611	AP 660 Omada AX-3600HD	Tp-Link	Access Point	22234W8000366	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.726
614	AST-00612	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2222357000771	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.732
615	AST-00613	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2222357000789	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.739
616	AST-00614	AP 660 Omada AX-3600HD	Tp-Link	Access Point	(Air)2222357000779	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.746
617	AST-00615	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2222357000829	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.754
618	AST-00616	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2227078001065	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.761
619	AST-00617	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2222357000773	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.769
620	AST-00618	AP 660 Omada AX-3600HD	Tp-Link	Access Point	(Air)2222357000778	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.777
621	AST-00619	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2222357000796	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.784
622	AST-00620	AP 660 Omada AX-3600HD	Tp-Link	Access Point	221B4A0000238	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.792
623	AST-00621	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2222357000797	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.799
624	AST-00622	AP 660 Omada AX-3600HD	Tp-Link	Access Point	(Air)2222357000775	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.806
625	AST-00623	AP 660 Omada AX-3600HD	Tp-Link	Access Point	221B4A0000252	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.813
626	AST-00624	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2227078001079	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.82
627	AST-00625	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2222357000742	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.827
628	AST-00626	AP 660 Omada AX-3600HD	Tp-Link	Access Point	B4B0240FA242	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.835
629	AST-00627	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2222357000741	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.844
630	AST-00628	AP 660 Omada AX-3600HD	Tp-Link	Access Point	22221L5000395	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.849
631	AST-00629	AP 660 Omada AX-3600HD	Tp-Link	Access Point	221B4A0000254	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.854
632	AST-00630	AP 660 Omada AX-3600HD	Tp-Link	Access Point	22221L5000394	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.86
633	AST-00631	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2222357000772	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.866
634	AST-00632	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2222357000826	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.871
635	AST-00633	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2222357000828	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.878
636	AST-00634	AP 660 Omada AX-3600HD	Tp-Link	Access Point	221B4A0000239	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.885
637	AST-00635	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2227078001064	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.891
638	AST-00636	AP 660 Omada AX-3600HD	Tp-Link	Access Point	224B4X9000786	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.898
639	AST-00637	AP 660 Omada AX-3600HD	Tp-Link	Access Point	(Air)2227078001147DP	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.904
640	AST-00638	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2222357000776	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.911
641	AST-00639	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2222357000786	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.917
642	AST-00640	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2222357000799	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.924
643	AST-00641	AP 660 Omada AX-3600HD	Tp-Link	Access Point	221B4A0000237	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.93
644	AST-00642	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2222357000780	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.938
645	AST-00643	AP 660 Omada AX-3600HD	Tp-Link	Access Point	B4B0240FA242	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.944
646	AST-00644	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2244753001683	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.95
647	AST-00645	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2244753001622	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.958
648	AST-00646	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2244753001487	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.964
649	AST-00647	AP 660 Omada AX-3600HD	Tp-Link	Access Point	224B4X9001634	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.971
650	AST-00648	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2244753001498	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.978
651	AST-00649	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2244753001797	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.985
652	AST-00650	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2248171000615	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:17.992
653	AST-00651	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2222357000827	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:18
654	AST-00652	AP 660 Omada AX-3600HD	Tp-Link	Access Point	221B4A0000253	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:18.007
655	AST-00653	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2222357000800	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:18.015
656	AST-00654	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2244753001693	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:18.022
657	AST-00655	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2244753001702	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:18.029
658	AST-00656	AP 660 Omada AX-3600HD	Tp-Link	Access Point	2248171000596	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 10:25:18.036
659	AST-00657	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2235354000486	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.304
660	AST-00658	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22234W8000486	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.357
661	AST-00659	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22363R1000649	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.364
662	AST-00660	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2222357000800	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.37
663	AST-00661	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22234W8000337	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.375
664	AST-00662	AP 670 Omada AX-5400HD	Tp-Link	Access Point	(Air)2235354000513	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.381
665	AST-00663	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22363R1000479	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.386
666	AST-00664	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2235354000362	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.391
667	AST-00665	AP 670 Omada AX-5400HD	Tp-Link	Access Point	AC15A27BA300	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.398
668	AST-00666	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2235354000932	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.404
669	AST-00667	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22363R1000031	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.409
670	AST-00668	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22363R1000342	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.414
671	AST-00669	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2236R1000649	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.418
672	AST-00670	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2235354000385	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.423
673	AST-00671	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22363R1000162	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.428
674	AST-00672	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2235354000934	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.432
675	AST-00673	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22363R1000455	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.436
676	AST-00674	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22363R1000161	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.44
677	AST-00675	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22363R1000343	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.445
678	AST-00676	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2235354000367	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.45
679	AST-00677	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22363R1000453	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.454
680	AST-00678	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2235354000383	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.459
681	AST-00679	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22234W8000853	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.464
682	AST-00680	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2235354000945	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.468
683	AST-00681	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2235354000933	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.473
684	AST-00682	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22363R1000163	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.477
685	AST-00683	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2235354000364	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.481
686	AST-00684	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22234W8000395	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.485
687	AST-00685	AP 670 Omada AX-5400HD	Tp-Link	Access Point	222C359000917	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.489
688	AST-00686	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2235354000515	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.493
689	AST-00687	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22234W8000834	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.498
690	AST-00688	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22234W8000874	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.503
691	AST-00689	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2235354001421	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.507
692	AST-00690	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2235354000496	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.513
693	AST-00691	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2235354000498	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.517
694	AST-00692	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2235354000499	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.522
695	AST-00693	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22363R1000344	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.526
696	AST-00694	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22223540003023	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.531
697	AST-00695	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22363R1000084	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.535
698	AST-00696	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2235354000363	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.539
699	AST-00697	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22234W8000814	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.543
700	AST-00698	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22363R1000647	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.547
701	AST-00699	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2235354000935	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.551
702	AST-00700	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22363R1000454	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.556
703	AST-00701	AP 670 Omada AX-5400HD	Tp-Link	Access Point	2235354000417	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.561
704	AST-00702	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22234W8000392	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.566
705	AST-00703	AP 670 Omada AX-5400HD	Tp-Link	Access Point	222C9L3001543	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.57
706	AST-00704	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22234W8000231	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.575
707	AST-00705	AP 670 Omada AX-5400HD	Tp-Link	Access Point	22234W8000308	Ready to Deploy	\N	\N	2026-09-29	0	\N	2026-09-29 11:46:04.58
708	AST-00706	ONT 1200 XC220-G3v	Tp-Link	ONT	2232012003215	Deployed	\N	\N	2026-09-30	0	Deployed in Av nagar	2026-09-30 05:11:39.731
709	AST-00707	ONT 1200 XC220-G3v	Tp-Link	ONT	223A4F6005013	Deployed	\N	\N	2026-09-30	0	C106, Pocket A, INA Colony	2026-09-30 05:12:06.737
710	AST-00708	ONT 1200 XC220-G3v	Tp-Link	ONT	223A4F6005027	Deployed	\N	\N	2026-09-30	0	202/2 Masjid moth	2026-09-30 05:12:23.146
711	AST-00709	ONT 1200 XC220-G3v	Tp-Link	ONT	2241433005530	Deployed	\N	\N	2026-09-30	0	JLN	2026-09-30 05:12:30.398
712	AST-00710	ONT 1200 XC220-G3v	Tp-Link	ONT	2241433006093	Deployed	\N	\N	2026-09-30	0	JLN	2026-09-30 05:12:37.662
713	AST-00711	ONT 3000 XX530v	Tp-Link	ONT	224B319001036	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:14:24.179
714	AST-00712	ONT 3000 XX530v	Tp-Link	ONT	224B319003369	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:14:24.19
715	AST-00713	ONT 3000 XX530v	Tp-Link	ONT	224B319003436	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:14:24.194
716	AST-00714	ONT 3000 XX530v	Tp-Link	ONT	2254723000233	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:14:24.199
717	AST-00715	ONT 3000 XX530v	Tp-Link	ONT	2254723000471	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:14:24.202
718	AST-00716	ONT 3000 XX530v	Tp-Link	ONT	224B319001229	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:14:24.206
719	AST-00717	ONT 3000 XX530v	Tp-Link	ONT	224B319003360	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:14:24.21
720	AST-00718	ONT 3000 XX530v	Tp-Link	ONT	224B319001394	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:14:24.213
721	AST-00719	ONT 3000 XX530v	Tp-Link	ONT	224B319003348	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:14:24.218
722	AST-00720	AP C9115AXI-D	Cisco	Access Point	FVT2916L1FT	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.519
723	AST-00721	AP C9115AXI-D	Cisco	Access Point	FGL2618L3NM	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.536
724	AST-00722	AP C9115AXI-D	Cisco	Access Point	FGL2530MMP9	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.543
725	AST-00723	AP C9115AXI-D	Cisco	Access Point	FVT2916L1G2	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.55
726	AST-00724	AP C9115AXI-D	Cisco	Access Point	FVT2916L1G1	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.559
727	AST-00725	AP C9115AXI-D	Cisco	Access Point	FVT2916L1FQ	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.568
728	AST-00726	AP C9115AXI-D	Cisco	Access Point	FGL2530MN2Q	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.574
729	AST-00727	AP C9115AXI-D	Cisco	Access Point	FGL2530MN2W	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.582
730	AST-00728	AP C9115AXI-D	Cisco	Access Point	FGL2530MMLC	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.59
731	AST-00729	AP C9115AXI-D	Cisco	Access Point	FVT2916L1FY	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.598
732	AST-00730	AP C9115AXI-D	Cisco	Access Point	FVT2911L2WN	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.604
733	AST-00731	AP C9115AXI-D	Cisco	Access Point	FGL2530MMMH	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.611
734	AST-00732	AP C9115AXI-D	Cisco	Access Point	FGL2530MN34	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.618
735	AST-00733	AP C9115AXI-D	Cisco	Access Point	FVT2916L1FL	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.624
736	AST-00734	AP C9115AXI-D	Cisco	Access Point	FGL2530MMNT	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.632
737	AST-00735	AP C9115AXI-D	Cisco	Access Point	FVT2916L1FZ	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.639
738	AST-00736	AP C9115AXI-D	Cisco	Access Point	FVT2907L2E5	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.646
739	AST-00737	AP C9115AXI-D	Cisco	Access Point	FGL2618L3LS	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.652
740	AST-00738	AP C9115AXI-D	Cisco	Access Point	FGL2530MMLZ	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.658
741	AST-00739	AP C9115AXI-D	Cisco	Access Point	FGL2618L3QS	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.666
742	AST-00740	AP C9115AXI-D	Cisco	Access Point	FVT2911L2X1	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.672
743	AST-00741	AP C9115AXI-D	Cisco	Access Point	FVT2907L2E2	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:15:24.679
744	AST-00742	AP 3802I-D-K9	Cisco	Access Point	FGL2314A7GP	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.338
745	AST-00743	AP 3802I-D-K9	Cisco	Access Point	FGL2425LA0D	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.349
746	AST-00744	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9V4	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.352
747	AST-00745	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9V5	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.355
748	AST-00746	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9V8	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.358
749	AST-00747	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9XY	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.361
750	AST-00748	AP 3802I-D-K9	Cisco	Access Point	FGL2424LKQR	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.364
751	AST-00749	AP 3802I-D-K9	Cisco	Access Point	FGL2425L00U	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.367
752	AST-00750	AP 3802I-D-K9	Cisco	Access Point	FGL2424LKST	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.37
753	AST-00751	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9V2	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.374
754	AST-00752	AP 3802I-D-K9	Cisco	Access Point	FGL2425L01Q	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.377
755	AST-00753	AP 3802I-D-K9	Cisco	Access Point	FGL2110A5EF	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.379
756	AST-00754	AP 3802I-D-K9	Cisco	Access Point	JIN2134B01P	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.382
757	AST-00755	AP 3802I-D-K9	Cisco	Access Point	JIN2127B02Y	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.385
758	AST-00756	AP 3802I-D-K9	Cisco	Access Point	FGL2329LBTY	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.387
759	AST-00757	AP 3802I-D-K9	Cisco	Access Point	FGL2424LKQN	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.389
760	AST-00758	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9YA	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.392
761	AST-00759	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9YV	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.394
762	AST-00760	AP 3802I-D-K9	Cisco	Access Point	FGL2314A7GD	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.397
763	AST-00761	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9XE	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.399
764	AST-00762	AP 3802I-D-K9	Cisco	Access Point	FGL2329LBB5	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.402
765	AST-00763	AP 3802I-D-K9	Cisco	Access Point	FGL2424LKQY	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.405
766	AST-00764	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9YX	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.407
767	AST-00765	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9XU	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.409
768	AST-00766	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9VR	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.412
769	AST-00767	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9XD	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.415
770	AST-00768	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9WU	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.417
771	AST-00769	AP 3802I-D-K9	Cisco	Access Point	FGL2425LA0H	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.42
772	AST-00770	AP 3802I-D-K9	Cisco	Access Point	FGL2605LU8Q	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.423
773	AST-00771	AP 3802I-D-K9	Cisco	Access Point	FGL2425LA0B	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.425
774	AST-00772	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9XT	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.428
775	AST-00773	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9YF	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.43
776	AST-00774	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9VP	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.433
777	AST-00775	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9ZX	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.435
778	AST-00776	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9VM	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.438
779	AST-00777	AP 3802I-D-K9	Cisco	Access Point	FGL2425LA0V	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.44
780	AST-00778	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9VL	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.443
781	AST-00779	AP 3802I-D-K9	Cisco	Access Point	FGL2424LKSK	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.446
782	AST-00780	AP 3802I-D-K9	Cisco	Access Point	JIN2127B02W	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.448
783	AST-00781	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9Y9	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.451
784	AST-00782	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9WF	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.454
785	AST-00783	AP 3802I-D-K9	Cisco	Access Point	FGL2314A7GJ	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.456
786	AST-00784	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9V3	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.458
787	AST-00785	AP 3802I-D-K9	Cisco	Access Point	FGL2425L9YC	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.461
788	AST-00786	AP 3802I-D-K9	Cisco	Access Point	FGL2314A7G5	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.463
789	AST-00787	AP 3802I-D-K9	Cisco	Access Point	FGL2110A5EE	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.465
790	AST-00788	AP 3802I-D-K9	Cisco	Access Point	FGL2425LA0W	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.468
791	AST-00789	AP 3802I-D-K9	Cisco	Access Point	FGL2309A8SY	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.47
792	AST-00790	AP 3802I-D-K9	Cisco	Access Point	FGL2110A5EA	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.472
793	AST-00791	AP 3802I-D-K9	Cisco	Access Point	FGL2605LU83	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:16:17.475
794	AST-00792	AP 750	Ruckus	Access Point	192322024907	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.518
795	AST-00793	AP 750	Ruckus	Access Point	212322032630	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.538
796	AST-00794	AP 750	Ruckus	Access Point	212322031603	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.545
797	AST-00795	AP 750	Ruckus	Access Point	192322025437	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.554
798	AST-00796	AP 750	Ruckus	Access Point	492372004378	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.56
799	AST-00797	AP 750	Ruckus	Access Point	212322031671	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.566
800	AST-00798	AP 750	Ruckus	Access Point	492372004537	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.572
801	AST-00799	AP 750	Ruckus	Access Point	192322023339	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.578
802	AST-00800	AP 750	Ruckus	Access Point	212322006461	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.584
803	AST-00801	AP 750	Ruckus	Access Point	192322021721	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.59
804	AST-00802	AP 750	Ruckus	Access Point	212322031837	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.596
805	AST-00803	AP 750	Ruckus	Access Point	192322021523	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.601
806	AST-00804	AP 750	Ruckus	Access Point	212322031082	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.606
807	AST-00805	AP 750	Ruckus	Access Point	212322006333	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.613
808	AST-00806	AP 750	Ruckus	Access Point	212322031531	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.619
809	AST-00807	AP 750	Ruckus	Access Point	172322000544	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.627
810	AST-00808	AP 750	Ruckus	Access Point	212322034740	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.634
811	AST-00809	AP 750	Ruckus	Access Point	492372004521	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.641
812	AST-00810	AP 650	Ruckus	Access Point	322139000349	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.649
813	AST-00811	AP 650	Ruckus	Access Point	312139002643	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.656
814	AST-00812	AP 650	Ruckus	Access Point	322139000342	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.663
815	AST-00813	AP 750	Ruckus	Access Point	492372003492	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.671
816	AST-00814	AP 750	Ruckus	Access Point	212322006697	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.678
817	AST-00815	AP 650	Ruckus	Access Point	312139003316	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.684
818	AST-00816	AP 650	Ruckus	Access Point	322139000348	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.691
819	AST-00817	AP 750	Ruckus	Access Point	212322006434	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.698
820	AST-00818	AP 650	Ruckus	Access Point	322139000196	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.705
821	AST-00819	AP 750	Ruckus	Access Point	212322031251	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.711
822	AST-00820	AP 750	Ruckus	Access Point	212322006694	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.718
823	AST-00821	AP 750	Ruckus	Access Point	212322006780	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.725
824	AST-00822	AP 750	Ruckus	Access Point	212322029654	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.732
825	AST-00823	AP 750	Ruckus	Access Point	212322031214	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.739
826	AST-00824	AP 750	Ruckus	Access Point	212322030213	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.746
827	AST-00825	AP 750	Ruckus	Access Point	192322025819	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.753
828	AST-00826	AP 750	Ruckus	Access Point	492372004632	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.761
829	AST-00827	AP 750	Ruckus	Access Point	192322021647	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.769
830	AST-00828	AP 750	Ruckus	Access Point	192322021779	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.776
831	AST-00829	AP 750	Ruckus	Access Point	212322032369	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.783
832	AST-00830	AP 650	Ruckus	Access Point	322139000350	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.789
833	AST-00831	AP 750	Ruckus	Access Point	192322023253	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.796
834	AST-00832	AP 750	Ruckus	Access Point	212322032625	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.802
835	AST-00833	AP 750	Ruckus	Access Point	492372004093	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.808
836	AST-00834	AP 750	Ruckus	Access Point	212322030810	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.816
837	AST-00835	AP 750	Ruckus	Access Point	492372003620	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.822
838	AST-00836	AP 750	Ruckus	Access Point	212322006439	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.829
839	AST-00837	AP 750	Ruckus	Access Point	492372004519	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:17:39.837
841	AST-00839	AP 650	Ruckus	Access Point	322139000347	Deployed	\N	\N	2026-09-30	0	NIUA	2026-09-30 05:20:19.455
842	AST-00840	AP 650	Ruckus	Access Point	322139000164	Deployed	\N	\N	2026-09-30	0	NIUA	2026-09-30 05:20:19.462
843	AST-00841	AP 650	Ruckus	Access Point	312139002701	Deployed	\N	\N	2026-09-30	0	NIUA	2026-09-30 05:20:19.469
844	AST-00842	AP 650	Ruckus	Access Point	322139000352	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:20:59.443
845	AST-00843	AP 750	Ruckus	Access Point	192322021567	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:20:59.456
846	AST-00844	AP 750	Ruckus	Access Point	492372004545	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:20:59.459
847	AST-00845	AP 750	Ruckus	Access Point	212322030580	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:20:59.463
848	AST-00846	AP 750	Ruckus	Access Point	212322031217	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:20:59.466
849	AST-00847	AP 750	Ruckus	Access Point	492372004517	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:20:59.469
850	AST-00848	Switch 8Port 3560CX	Cisco	Switch	356044901	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.1
851	AST-00849	Switch 8Port 3560CX	Cisco	Switch	356044902	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.111
852	AST-00850	Switch 8Port 3560CX	Cisco	Switch	FOC2112Z31P	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.114
853	AST-00851	Switch 8Port 3560CX	Cisco	Switch	FOC1917Y058	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.117
854	AST-00852	Switch 8Port 3560CX	Cisco	Switch	356044905	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.12
855	AST-00853	Switch 8Port 3560CX	Cisco	Switch	356044906	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.124
856	AST-00854	Switch 8Port 3560CX	Cisco	Switch	356044907	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.126
857	AST-00855	Switch 8Port 3560CX	Cisco	Switch	356044908	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.129
858	AST-00856	Switch 8Port 3560CX	Cisco	Switch	356044909	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.132
859	AST-00857	Switch 8Port 3560CX	Cisco	Switch	356044910	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.136
860	AST-00858	Switch 8Port 3560CX	Cisco	Switch	356044911	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.139
861	AST-00859	Switch 8Port 3560CX	Cisco	Switch	356044912	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.142
862	AST-00860	Switch 8Port 3560CX	Cisco	Switch	356044913	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.145
863	AST-00861	Switch 8Port 3560CX	Cisco	Switch	356044914	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.147
864	AST-00862	Switch 8Port 3560CX	Cisco	Switch	356044915	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.149
865	AST-00863	Switch 8Port 3560CX	Cisco	Switch	FOC1937Y1	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.152
866	AST-00864	Switch 8Port 3560CX	Cisco	Switch	356044917	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.154
867	AST-00865	Switch 8Port 3560CX	Cisco	Switch	356044918	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.156
868	AST-00866	Switch 8Port 3560CX	Cisco	Switch	356044919	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.159
869	AST-00867	Switch 8Port 3560CX	Cisco	Switch	356044920	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.162
870	AST-00868	Switch 8Port 2960C	Cisco	Switch	FOC1709Y4QQ	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.165
871	AST-00869	Switch 8Port 3560CX	Cisco	Switch	FOC1925W4SW	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.167
872	AST-00870	Switch 8Port 2960C	Cisco	Switch	FOC1849Y0XF	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.17
873	AST-00871	Switch 8Port 3560CX	Cisco	Switch	FOC2002W0PQ	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.172
874	AST-00872	Switch 8Port 2960C	Cisco	Switch	FOC2111Y218	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:23:16.174
875	AST-00873	Switch 24 Port C-2950	Cisco	Switch	FOC1006Z75C	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:26:14.252
876	AST-00874	Switch 28 Port SG-350	Cisco	Switch	DNI2041020B	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:26:14.269
877	AST-00875	Switch 48 Port SG-352	Cisco	Switch	DNI2122057E	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:26:14.277
878	AST-00876	Gigabit Switch SG108E	Tp-Link	Switch	22570XT001122	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:30:56.503
879	AST-00877	Gigabit Switch SG108E	Tp-Link	Switch	22570XT002510	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:30:56.516
880	AST-00878	Switch SG1024D	Tp-Link	Switch	22252P6001267	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:32:25.088
881	AST-00879	Switch SG1024D	Tp-Link	Switch	22252P6001268	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:32:25.099
882	AST-00880	Switch SG1016D	Tp-Link	Switch	2227090001684	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:33:56.468
883	AST-00881	Switch SG1016D	Tp-Link	Switch	2227090001679	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:33:56.486
884	AST-00882	Switch SG1016D	Tp-Link	Switch	22264U8000314	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:33:56.492
885	AST-00883	Switch SG1016D	Tp-Link	Switch	2227090001678	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:33:56.499
886	AST-00884	Switch SG1016D	Tp-Link	Switch	2227090001681	Ready to Deploy	\N	\N	2026-09-30	0	\N	2026-09-30 05:33:56.505
\.


--
-- Data for Name: Consumable; Type: TABLE DATA; Schema: public; Owner: snipeit
--

COPY public."Consumable" (id, name, category, "modelNumber", "totalQuantity", "remainingQuantity", "minQuantity", location) FROM stdin;
\.


--
-- Data for Name: EventItem; Type: TABLE DATA; Schema: public; Owner: snipeit
--

COPY public."EventItem" (id, name, department, "startDate", "endDate", location, "primaryRequesterId", "primaryRequesterName", "requesterIds", "requesterNames", "assetIds", status, "dispatchStatus", "purposeOrDescription", "expectedReturnDate", "contactPhone", "contactEmail", "projectCode", "specialInstructions", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: License; Type: TABLE DATA; Schema: public; Owner: snipeit
--

COPY public."License" (id, name, category, key, "totalSeats", "assignedUserIds", "expirationDate", manufacturer, "purchaseCost") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: snipeit
--

COPY public."User" (id, name, email, role, "employeeNum", department, location, "avatarUrl", "passwordHash") FROM stdin;
usr-1	Prateek S	Prateek.s@connectinfosys.com	Superadmin	EMP-001	Management	HQ	\N	A!RConnect@#$12131
usr-2	Prakhar S	prakhar.s@connectinfosys.com	Superadmin	EMP-002	Management	HQ	\N	A!RConnect@#$12131
usr-3	Vinay	vinay@connectinfosys.com	Superadmin	EMP-003	Management	HQ	\N	0N3allsoln@#$12131
usr-4	Vikram S	Vikram.s@connectinfosys.com	Admin	EMP-004	IT	HQ	\N	V!kr@m@123
usr-5	Guarav	purchase@connectinfosys.com	Inventory Manager	EMP-005	Procurement	HQ	\N	Invent.y@0
usr-6	Ummat	ummat@connectinfosys.com	Tech	EMP-006	Sr. Network Eng	HQ	\N	Hertz!!123
usr-7	Deepesh P	deepesh.p@connectinfosys.com	Tech	EMP-007	Field Support	HQ	\N	Tech@#$121_1
usr-8	Piyush T	piyush.t@connectinfosys.com	Tech	EMP-008	Field Support	HQ	\N	Tech@#$121_2
usr-9	Prem Y	prem.y@connectinfosys.com	Tech	EMP-009	Field Support	HQ	\N	C0Eff!c!en$T
usr-10	Abhishek	abhishek@connectinfosys.com	Tech	EMP-010	Field Support	HQ	\N	Tech@#$121_04
usr-11	Rahul M	rahul.m@connectinfosys.com	Tech	EMP-011	Field Support	HQ	\N	Tech@#$121_05
\.


--
-- Name: Asset_id_seq; Type: SEQUENCE SET; Schema: public; Owner: snipeit
--

SELECT pg_catalog.setval('public."Asset_id_seq"', 886, true);


--
-- Name: Accessory Accessory_pkey; Type: CONSTRAINT; Schema: public; Owner: snipeit
--

ALTER TABLE ONLY public."Accessory"
    ADD CONSTRAINT "Accessory_pkey" PRIMARY KEY (id);


--
-- Name: ActivityLog ActivityLog_pkey; Type: CONSTRAINT; Schema: public; Owner: snipeit
--

ALTER TABLE ONLY public."ActivityLog"
    ADD CONSTRAINT "ActivityLog_pkey" PRIMARY KEY (id);


--
-- Name: Asset Asset_pkey; Type: CONSTRAINT; Schema: public; Owner: snipeit
--

ALTER TABLE ONLY public."Asset"
    ADD CONSTRAINT "Asset_pkey" PRIMARY KEY (id);


--
-- Name: Consumable Consumable_pkey; Type: CONSTRAINT; Schema: public; Owner: snipeit
--

ALTER TABLE ONLY public."Consumable"
    ADD CONSTRAINT "Consumable_pkey" PRIMARY KEY (id);


--
-- Name: EventItem EventItem_pkey; Type: CONSTRAINT; Schema: public; Owner: snipeit
--

ALTER TABLE ONLY public."EventItem"
    ADD CONSTRAINT "EventItem_pkey" PRIMARY KEY (id);


--
-- Name: License License_pkey; Type: CONSTRAINT; Schema: public; Owner: snipeit
--

ALTER TABLE ONLY public."License"
    ADD CONSTRAINT "License_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: snipeit
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Asset_assetTag_key; Type: INDEX; Schema: public; Owner: snipeit
--

CREATE UNIQUE INDEX "Asset_assetTag_key" ON public."Asset" USING btree ("assetTag");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: snipeit
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: snipeit
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict Gs9WL00SSOfUUtgkfuUEsW31bCZQ974fMCiRUwbxsS2d65GOj8ZGMsdGwwn0CoQ

