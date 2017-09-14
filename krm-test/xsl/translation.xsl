<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xi="http://www.w3.org/2001/XInclude" xmlns:tei="http://www.tei-c.org/ns/1.0" xmlns:fn="http://www.w3.org/2005/xpath-functions" version="1.0" exclude-result-prefixes="tei xi fn">
  <xsl:output method="html" indent="no" encoding="UTF-8" version="4.0"/>

  <xsl:template match="tei:caesura">
    <xsl:element name="span">
      <xsl:attribute name="class">
	<xsl:text>caesura</xsl:text>
      </xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:foreign">
    <xsl:element name="em">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:hi">
    <xsl:element name="em">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:l">
    <xsl:element name="span">
      <xsl:attribute name="class">
	<xsl:text>tr-l</xsl:text>
      </xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:lg">
    <xsl:element name="h4">
      <xsl:text>Translation</xsl:text>
    </xsl:element>
    <xsl:element name="div">
      <xsl:attribute name="class">
        <xsl:text>lg</xsl:text>
      </xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
    <xsl:if test="tei:note">
      <xsl:apply-templates select="tei:note" mode="bypass"/>
    </xsl:if>
  </xsl:template>
  <xsl:template match="tei:note"/>
  <xsl:template match="tei:note" mode="bypass">
    <xsl:element name="h4">
      <xsl:text>Notes</xsl:text>
    </xsl:element>
    <xsl:element name="div">
      <xsl:attribute name="class">
	<xsl:text>notes</xsl:text>
      </xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:p">
    <xsl:element name="p">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

</xsl:stylesheet>
